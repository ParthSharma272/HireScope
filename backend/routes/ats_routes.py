"""
ATS Simulator Routes
Shows users exactly what ATS systems see when parsing their resume
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
import re
from core.parsing import extract_text_from_file

router = APIRouter(prefix="/api/ats", tags=["ats-simulator"])


def analyze_ats_parsing(text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze how well the resume will be parsed by ATS systems
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
    
    # Check for URLs
    urls = re.findall(r'https?://\S+|www\.\S+', text)
    if urls:
        issues.append({
            "type": "urls",
            "severity": "low",
            "message": f"Found {len(urls)} URLs in resume",
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
    
    # Check for common section headers (expanded list)
    common_headers = [
        'experience', 'education', 'skills', 'summary', 'objective',
        'work experience', 'professional experience', 'employment',
        'certifications', 'certificates', 'projects', 'portfolio',
        'achievements', 'accomplishments', 'awards',
        'languages', 'technical skills', 'soft skills',
        'qualifications', 'profile', 'about', 'background',
        'training', 'courses', 'volunteer', 'activities',
        'interests', 'hobbies', 'references', 'publications'
    ]
    found_headers = []
    text_lower = text.lower()
    
    # Count unique section headers found
    seen_headers = set()
    for header in common_headers:
        # Use word boundary to avoid partial matches
        if re.search(r'\b' + re.escape(header) + r'\b', text_lower):
            # Add to seen set to avoid counting variations of same section
            base = header.split()[0]  # e.g., "work experience" -> "work"
            if base not in seen_headers:
                seen_headers.add(base)
                found_headers.append(header)
    
    if len(found_headers) < 3:
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
            "urls_found": len(urls),
            "sections_detected": len(found_headers),  # Return count, not list
            "sections_list": found_headers  # Keep list for reference
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
