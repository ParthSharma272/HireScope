"""
ATS Simulator Routes
Shows users exactly what ATS systems see when parsing their resume
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any, List, Tuple
import re
from core.parsing import extract_text_from_file
from sentence_transformers import util
import torch

router = APIRouter(prefix="/api/ats", tags=["ats-simulator"])

# Load embedding model lazily
_embedding_model = None

def get_embedding_model():
    """Lazy load the embedding model"""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedding_model


def extract_urls_intelligently(text: str) -> Tuple[List[str], List[str]]:
    """
    Extract URLs and categorize them using intelligent pattern matching
    Returns: (social_urls, other_urls)
    """
    # Enhanced URL regex that captures complete URLs
    url_pattern = r'(?:https?://)?(?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&/=]*)'
    urls = re.findall(url_pattern, text)
    
    # Clean and filter URLs
    cleaned_urls = []
    for url in urls:
        url = url.strip('.,;:()[]{}')
        # Must have at least one dot and some extension
        if '.' in url and len(url) > 5:
            # Add protocol if missing
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            cleaned_urls.append(url)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_urls = []
    for url in cleaned_urls:
        if url.lower() not in seen:
            seen.add(url.lower())
            unique_urls.append(url)
    
    # Categorize URLs
    social_platforms = [
        'linkedin.com', 'github.com', 'twitter.com', 'facebook.com', 
        'instagram.com', 'behance.net', 'dribbble.com', 'medium.com',
        'stackoverflow.com', 'gitlab.com', 'youtube.com', 'reddit.com',
        'dev.to', 'hashnode.', 'substack.com', 'tiktok.com'
    ]
    
    social_urls = []
    other_urls = []
    
    for url in unique_urls:
        url_lower = url.lower()
        is_social = any(platform in url_lower for platform in social_platforms)
        if is_social:
            social_urls.append(url)
        else:
            other_urls.append(url)
    
    return social_urls, other_urls


def detect_sections_intelligently(text: str) -> List[str]:
    """
    Use LLM to intelligently detect resume sections without hardcoded lists.
    Looks for capitalized headers and validates them semantically.
    """
    lines = text.split('\n')
    potential_sections = []
    
    # Find lines that look like section headers:
    # 1. All caps or title case
    # 2. Short (1-5 words)
    # 3. Not too long
    # 4. May have special formatting (bold indicators like all caps)
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Skip empty lines
        if not stripped:
            continue
        
        # Skip lines that are too long (probably not headers)
        if len(stripped) > 50:
            continue
        
        # Check if line looks like a header
        words = stripped.split()
        if len(words) == 0 or len(words) > 5:
            continue
        
        # Heuristics for section headers:
        # - All uppercase
        # - Title case (each word capitalized)
        # - Contains common section keywords
        is_all_caps = stripped.isupper() and len(stripped) > 2
        is_title_case = stripped.istitle()
        has_alpha = any(c.isalpha() for c in stripped)
        
        # Remove special characters for analysis
        clean_text = re.sub(r'[^\w\s]', '', stripped).strip()
        
        if (is_all_caps or is_title_case) and has_alpha and len(clean_text) > 2:
            # Check if next line has content (section headers are usually followed by content)
            has_content_after = False
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line and not next_line.isupper():
                    has_content_after = True
            
            if has_content_after or is_all_caps:
                potential_sections.append(clean_text.lower())
    
    # Remove duplicates
    potential_sections = list(set(potential_sections))
    
    # Use embeddings to filter out non-section text
    if len(potential_sections) > 0:
        try:
            model = get_embedding_model()
            
            # Reference section headers (examples of what sections should look like)
            reference_sections = [
                "work experience", "education", "skills", "summary",
                "professional experience", "projects", "certifications",
                "achievements", "languages", "interests", "references"
            ]
            
            # Generate embeddings
            reference_embeddings = model.encode(reference_sections, convert_to_tensor=True)
            candidate_embeddings = model.encode(potential_sections, convert_to_tensor=True)
            
            # Filter candidates based on similarity to reference sections
            valid_sections = []
            for i, candidate in enumerate(potential_sections):
                # Calculate similarity to all reference sections
                similarities = util.pytorch_cos_sim(candidate_embeddings[i], reference_embeddings)[0]
                max_similarity = similarities.max().item()
                
                # If similar enough to any reference section (threshold 0.4), it's likely a section
                if max_similarity > 0.4:
                    valid_sections.append(candidate)
            
            potential_sections = valid_sections
        except Exception as e:
            print(f"Warning: Could not use embeddings for section validation: {e}")
    
    # Deduplicate using semantic similarity
    if len(potential_sections) > 1:
        try:
            potential_sections = deduplicate_sections_with_llm(potential_sections)
        except Exception as e:
            print(f"Warning: Could not deduplicate sections: {e}")
    
    return potential_sections


def deduplicate_sections_with_llm(found_headers: List[str]) -> List[str]:
    """
    Use semantic similarity to group similar section headers together
    Returns only unique sections (removes duplicates like 'experience' and 'work experience')
    """
    if len(found_headers) <= 1:
        return found_headers
    
    try:
        model = get_embedding_model()
        
        # Generate embeddings for all headers
        embeddings = model.encode(found_headers, convert_to_tensor=True)
        
        # Find similar pairs using cosine similarity
        unique_sections = []
        used_indices = set()
        
        for i, header in enumerate(found_headers):
            if i in used_indices:
                continue
                
            # Mark this as used
            used_indices.add(i)
            unique_sections.append(header)
            
            # Find similar headers (similarity > 0.7 means they're likely the same section)
            for j in range(i + 1, len(found_headers)):
                if j not in used_indices:
                    similarity = util.pytorch_cos_sim(embeddings[i], embeddings[j]).item()
                    if similarity > 0.7:  # High similarity threshold
                        used_indices.add(j)
        
        return unique_sections
        
    except Exception as e:
        # Fallback to original list if embedding fails
        print(f"Warning: Could not use embeddings for section deduplication: {e}")
        return found_headers


def analyze_ats_parsing(text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze how well the resume will be parsed by ATS systems
    Uses intelligent detection instead of hardcoded patterns
    """
    issues = []
    
    # Check for special characters that might cause issues (excluding common punctuation)
    # Only flag truly problematic characters: emoji, decorative symbols, etc.
    special_chars = re.findall(r'[^\w\s\-.,@()\[\]:/;\'\"!?#%&+=<>|\n\r\t]', text)
    if len(special_chars) > 20:
        issues.append({
            "type": "special_characters",
            "severity": "medium",
            "message": f"Found {len(special_chars)} special characters that may not parse correctly",
            "suggestion": "Remove decorative symbols, emoji, or unusual characters"
        })
    
    # Check for common formatting issues
    lines = text.split('\n')
    
    # Check for very short lines (might indicate formatting issues)
    short_lines = [line for line in lines if line.strip() and len(line.strip()) < 5]
    if len(short_lines) > 5:
        issues.append({
            "type": "formatting",
            "severity": "medium",
            "message": f"Found {len(short_lines)} very short lines that might indicate table or column formatting",
            "suggestion": "Avoid tables and multi-column layouts - use simple single-column format"
        })
    
    # Check for bullet point characters
    bullet_types = set()
    for line in lines:
        stripped = line.strip()
        if stripped and stripped[0] in ['•', '●', '◆', '■', '▪', '→', '»', '★', '✓']:
            bullet_types.add(stripped[0])
    
    if len(bullet_types) > 2:
        issues.append({
            "type": "bullets",
            "severity": "low",
            "message": f"Using {len(bullet_types)} different bullet styles",
            "suggestion": "Use consistent bullet points (• or -) throughout"
        })
    
    # Intelligently extract and categorize URLs
    social_urls, other_urls = extract_urls_intelligently(text)
    all_urls = social_urls + other_urls
    
    # Only flag non-social URLs as potential issues
    if other_urls:
        issues.append({
            "type": "urls",
            "severity": "low",
            "message": f"Found {len(other_urls)} URLs in resume",
            "suggestion": "URLs may break across lines - ensure they're on single lines"
        })
    
    # Check for email
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    if not emails:
        issues.append({
            "type": "contact",
            "severity": "high",
            "message": "No email address detected",
            "suggestion": "ATS systems look for contact information - ensure email is clearly visible"
        })
    
    # Check for phone numbers
    phones = re.findall(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if not phones:
        issues.append({
            "type": "contact",
            "severity": "medium",
            "message": "No phone number detected",
            "suggestion": "Include phone number in standard format: (123) 456-7890"
        })
    
    # Check if text is very short (might indicate parsing failure)
    if len(text.strip()) < 200:
        issues.append({
            "type": "parsing",
            "severity": "high",
            "message": "Very little text extracted - resume may not be parsing correctly",
            "suggestion": "Avoid images, text boxes, and complex formatting. Use standard text only."
        })
    
    # Intelligently detect sections using LLM
    unique_headers = detect_sections_intelligently(text)
    
    if len(unique_headers) < 3:
        issues.append({
            "type": "structure",
            "severity": "medium",
            "message": "Few standard section headers detected",
            "suggestion": "Use clear section headers: Experience, Education, Skills, Summary"
        })
    
    # Calculate ATS compatibility score
    base_score = 100
    for issue in issues:
        if issue['severity'] == 'high':
            base_score -= 15
        elif issue['severity'] == 'medium':
            base_score -= 8
        elif issue['severity'] == 'low':
            base_score -= 3
    
    ats_score = max(0, min(100, base_score))
    
    # Generate ATS-friendly version (plain text cleanup)
    ats_text = text
    # Replace special bullets with standard dash
    ats_text = re.sub(r'[•●◆■▪→»★✓]', '-', ats_text)
    # Remove extra whitespace
    ats_text = re.sub(r'\n{3,}', '\n\n', ats_text)
    ats_text = re.sub(r' {2,}', ' ', ats_text)
    
    return {
        "ats_score": ats_score,
        "issues": issues,
        "original_text": text,
        "ats_parsed_text": ats_text,
        "metadata": metadata,
        "statistics": {
            "total_characters": len(text),
            "total_lines": len([l for l in lines if l.strip()]),  # Only non-empty lines
            "emails_found": len(emails),
            "phones_found": len(phones),
            "urls_found": len(all_urls),
            "social_urls": social_urls,  # List of social media URLs
            "other_urls": other_urls,  # List of non-social URLs
            "sections_detected": len(unique_headers),  # Use deduplicated count
            "sections_list": unique_headers  # Use deduplicated list
        }
    }


@router.post("/simulate")
async def simulate_ats_parsing(file: UploadFile = File(...)):
    """
    Simulate ATS parsing of a resume file
    Shows what ATS systems actually see vs what the user created
    """
    try:
        # Read file content
        content = await file.read()
        
        # Extract text
        text, pages, metadata = extract_text_from_file(content, file.filename)
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from resume. File may be corrupt or heavily formatted."
            )
        
        # Analyze ATS compatibility
        analysis = analyze_ats_parsing(text, metadata)
        
        return analysis
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )
