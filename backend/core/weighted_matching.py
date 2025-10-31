# backend/core/weighted_matching.py
import re
import logging
from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class RequirementType(Enum):
    """Types of requirements in job descriptions"""
    REQUIRED = "required"
    PREFERRED = "preferred"
    BONUS = "bonus"
    UNKNOWN = "unknown"

@dataclass
class WeightedKeyword:
    """Keyword with its requirement type and weight"""
    keyword: str
    requirement_type: RequirementType
    weight: float
    section: str = "general"  # Which section it was found in

# Weight multipliers for different requirement types
REQUIREMENT_WEIGHTS = {
    RequirementType.REQUIRED: 2.0,   # Critical - must have
    RequirementType.PREFERRED: 1.0,  # Important - should have
    RequirementType.BONUS: 0.5,      # Nice to have - extra credit
    RequirementType.UNKNOWN: 1.0     # Default weight
}

# Section header patterns for identifying requirement types
SECTION_PATTERNS = {
    RequirementType.REQUIRED: [
        r'required\s+(?:skills|qualifications|experience)',
        r'must\s+have',
        r'requirements?:',
        r'essential\s+(?:skills|experience)',
        r'minimum\s+(?:qualifications|requirements)',
        r'you\s+(?:must|should|need\s+to)\s+have',
        r'we\s+require',
        r'mandatory',
    ],
    
    RequirementType.PREFERRED: [
        r'preferred\s+(?:skills|qualifications|experience)',
        r'nice\s+to\s+have',
        r'desired\s+(?:skills|qualifications)',
        r'plus(?:es)?:',
        r'ideally',
        r'you\s+(?:may|might|could)\s+have',
        r'advantageous',
        r'beneficial',
    ],
    
    RequirementType.BONUS: [
        r'bonus\s+(?:points|skills)',
        r'extra\s+credit',
        r'additional\s+(?:skills|experience)',
        r'a\s+plus',
        r'would\s+be\s+(?:nice|great)',
        r'optional',
    ]
}

def parse_jd_sections(jd_text: str) -> Dict[RequirementType, List[str]]:
    """
    Parse job description into sections based on requirement types.
    
    Returns dict of {RequirementType: [text_chunks]}
    """
    sections = {
        RequirementType.REQUIRED: [],
        RequirementType.PREFERRED: [],
        RequirementType.BONUS: [],
        RequirementType.UNKNOWN: []
    }
    
    jd_lower = jd_text.lower()
    lines = jd_text.split('\n')
    
    current_section = RequirementType.UNKNOWN
    current_chunk = []
    
    for line in lines:
        line_lower = line.lower().strip()
        
        if not line_lower:
            continue
        
        # Check if this line is a section header
        new_section = identify_section_type(line_lower)
        
        if new_section != RequirementType.UNKNOWN:
            # Save previous chunk
            if current_chunk:
                sections[current_section].append('\n'.join(current_chunk))
                current_chunk = []
            
            current_section = new_section
            current_chunk.append(line)
        else:
            current_chunk.append(line)
    
    # Save last chunk
    if current_chunk:
        sections[current_section].append('\n'.join(current_chunk))
    
    return sections


def identify_section_type(text: str) -> RequirementType:
    """Identify what type of requirement section this text belongs to"""
    for req_type, patterns in SECTION_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return req_type
    
    return RequirementType.UNKNOWN


def extract_weighted_keywords(jd_text: str, keyword_extractor) -> List[WeightedKeyword]:
    """
    Extract keywords with weights based on their requirement type.
    
    Args:
        jd_text: Job description text
        keyword_extractor: Function that extracts keywords from text (simple_keywords_from_jd)
    
    Returns:
        List of WeightedKeyword objects
    """
    logger.debug("Extracting weighted keywords from JD")
    
    # Parse JD into sections
    sections = parse_jd_sections(jd_text)
    
    weighted_keywords = []
    seen_keywords = set()
    
    # Extract keywords from each section with appropriate weights
    for req_type, text_chunks in sections.items():
        if not text_chunks:
            continue
        
        # Combine chunks for this section
        section_text = '\n'.join(text_chunks)
        
        # Extract keywords from this section
        keywords = keyword_extractor(section_text)
        
        base_weight = REQUIREMENT_WEIGHTS[req_type]
        
        for keyword in keywords:
            # Avoid duplicate keywords (keep highest weight)
            if keyword in seen_keywords:
                continue
            
            seen_keywords.add(keyword)
            
            weighted_keywords.append(WeightedKeyword(
                keyword=keyword,
                requirement_type=req_type,
                weight=base_weight,
                section=req_type.value
            ))
    
    # If no sections were identified, extract from entire text with default weight
    if not weighted_keywords:
        logger.warning("No sections identified, using default weights")
        keywords = keyword_extractor(jd_text)
        
        for keyword in keywords:
            weighted_keywords.append(WeightedKeyword(
                keyword=keyword,
                requirement_type=RequirementType.UNKNOWN,
                weight=1.0,
                section="general"
            ))
    
    logger.info(f"✅ Extracted {len(weighted_keywords)} weighted keywords")
    
    return weighted_keywords


def compute_weighted_match_score(
    resume_text: str,
    weighted_keywords: List[WeightedKeyword],
    skill_levels: Dict = None
) -> Dict:
    """
    Compute weighted keyword match score.
    
    Takes into account:
    - Keyword weights (required > preferred > bonus)
    - Skill proficiency levels (if available)
    - Match quality
    
    Returns detailed scoring breakdown
    """
    resume_lower = resume_text.lower()
    
    total_weight = sum(kw.weight for kw in weighted_keywords)
    matched_weight = 0.0
    
    matches_by_type = {
        RequirementType.REQUIRED: {'matched': [], 'missing': []},
        RequirementType.PREFERRED: {'matched': [], 'missing': []},
        RequirementType.BONUS: {'matched': [], 'missing': []},
        RequirementType.UNKNOWN: {'matched': [], 'missing': []}
    }
    
    for weighted_kw in weighted_keywords:
        keyword = weighted_kw.keyword
        req_type = weighted_kw.requirement_type
        weight = weighted_kw.weight
        
        # Check if keyword is in resume
        is_matched = False
        
        # Exact match
        if keyword in resume_lower:
            is_matched = True
        # Plural/singular variations
        elif keyword + 's' in resume_lower or \
             (keyword.endswith('s') and keyword[:-1] in resume_lower):
            is_matched = True
        
        if is_matched:
            # Apply skill level multiplier if available
            skill_multiplier = 1.0
            if skill_levels and keyword in skill_levels:
                level = skill_levels[keyword].level
                level_multipliers = {
                    'beginner': 0.7,
                    'intermediate': 1.0,
                    'advanced': 1.3,
                    'expert': 1.5
                }
                skill_multiplier = level_multipliers.get(level, 1.0)
            
            matched_weight += weight * skill_multiplier
            matches_by_type[req_type]['matched'].append(keyword)
        else:
            matches_by_type[req_type]['missing'].append(keyword)
    
    # Calculate scores
    overall_score = (matched_weight / total_weight) if total_weight > 0 else 0
    
    # Calculate critical requirements score (required skills only)
    required_kws = [kw for kw in weighted_keywords if kw.requirement_type == RequirementType.REQUIRED]
    if required_kws:
        required_total = sum(kw.weight for kw in required_kws)
        required_matched = sum(
            kw.weight for kw in required_kws 
            if kw.keyword in matches_by_type[RequirementType.REQUIRED]['matched']
        )
        critical_score = (required_matched / required_total) if required_total > 0 else 1.0
    else:
        critical_score = 1.0  # No required skills specified
    
    result = {
        'overall_score': round(overall_score, 3),
        'critical_score': round(critical_score, 3),
        'total_weight': round(total_weight, 2),
        'matched_weight': round(matched_weight, 2),
        'matches_by_type': {
            req_type.value: {
                'matched': data['matched'],
                'missing': data['missing'],
                'match_rate': len(data['matched']) / (len(data['matched']) + len(data['missing']))
                              if (len(data['matched']) + len(data['missing'])) > 0 else 0
            }
            for req_type, data in matches_by_type.items()
        },
        'summary': generate_match_summary(matches_by_type)
    }
    
    logger.info(f"✅ Weighted match score: {overall_score:.2%} (critical: {critical_score:.2%})")
    
    return result


def generate_match_summary(matches_by_type: Dict) -> Dict:
    """Generate human-readable summary of matches"""
    required_matched = len(matches_by_type[RequirementType.REQUIRED]['matched'])
    required_total = (
        len(matches_by_type[RequirementType.REQUIRED]['matched']) +
        len(matches_by_type[RequirementType.REQUIRED]['missing'])
    )
    
    preferred_matched = len(matches_by_type[RequirementType.PREFERRED]['matched'])
    preferred_total = (
        len(matches_by_type[RequirementType.PREFERRED]['matched']) +
        len(matches_by_type[RequirementType.PREFERRED]['missing'])
    )
    
    return {
        'required_skills': f"{required_matched}/{required_total}" if required_total > 0 else "N/A",
        'preferred_skills': f"{preferred_matched}/{preferred_total}" if preferred_total > 0 else "N/A",
        'recommendation': get_recommendation(
            required_matched / required_total if required_total > 0 else 1.0,
            preferred_matched / preferred_total if preferred_total > 0 else 1.0
        )
    }


def get_recommendation(required_rate: float, preferred_rate: float) -> str:
    """Generate recommendation based on match rates"""
    if required_rate >= 0.9:
        return "Excellent match! You meet all critical requirements."
    elif required_rate >= 0.7:
        return "Strong match! You meet most critical requirements."
    elif required_rate >= 0.5:
        return "Good match! Consider highlighting relevant experience."
    else:
        return "Partial match. Focus on developing required skills."
