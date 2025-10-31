# backend/core/skill_detection.py
import re
import logging
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class SkillLevel:
    """Data class for skill level information"""
    skill: str
    level: str  # 'beginner', 'intermediate', 'advanced', 'expert'
    years: Optional[int] = None
    confidence: float = 1.0  # 0.0 to 1.0

# Skill level indicators organized by proficiency
LEVEL_INDICATORS = {
    'beginner': [
        'basic', 'basics', 'fundamental', 'fundamentals', 'introduction',
        'intro', 'familiar', 'familiarity', 'exposure', 'learning',
        'studied', 'coursework', 'academic', 'beginner', 'novice',
        'starting', 'basic knowledge', 'basic understanding'
    ],
    
    'intermediate': [
        'intermediate', 'working knowledge', 'hands-on', 'practical',
        'experience', 'experienced', 'proficient', 'competent',
        'comfortable', 'solid understanding', 'good knowledge',
        'applied', 'utilized', 'implemented', 'developed with',
        'worked with', 'used extensively'
    ],
    
    'advanced': [
        'advanced', 'expert', 'expertise', 'deep', 'extensive',
        'comprehensive', 'thorough', 'mastery', 'master',
        'specialized', 'specialization', 'in-depth', 'sophisticated',
        'complex', 'architectural', 'designed', 'architected',
        'led development', 'expert level', 'highly skilled'
    ],
    
    'expert': [
        'guru', 'authority', 'thought leader', 'innovator',
        'pioneer', 'creator', 'inventor', 'contributor to',
        'open source contributor', 'published', 'speaker',
        'instructor', 'mentor', 'certified expert', 'lead architect',
        'subject matter expert', 'sme', 'recognized expert'
    ]
}

# Years of experience patterns
YEARS_PATTERNS = [
    r'(\d+)\+?\s*(?:years?|yrs?)',  # "5 years", "3+ years", "2 yrs"
    r'(\d+)\+?\s*(?:year|yr)\s+(?:of\s+)?experience',  # "3 year experience"
    r'(\d+)\s*(?:\-|to)\s*(\d+)\s*(?:years?|yrs?)',  # "2-4 years", "3 to 5 yrs"
]

def detect_skill_level(resume_text: str, skill: str) -> SkillLevel:
    """
    Detect proficiency level for a specific skill in resume text.
    
    Returns SkillLevel with:
    - level: beginner/intermediate/advanced/expert
    - years: number of years (if mentioned)
    - confidence: 0.0-1.0 based on evidence strength
    """
    resume_lower = resume_text.lower()
    skill_lower = skill.lower()
    
    # Find all mentions of the skill with surrounding context
    contexts = extract_skill_contexts(resume_lower, skill_lower)
    
    if not contexts:
        # Skill not found - return beginner with low confidence
        return SkillLevel(
            skill=skill,
            level='beginner',
            years=None,
            confidence=0.1
        )
    
    # Analyze each context for level indicators and years
    level_scores = {'beginner': 0, 'intermediate': 0, 'advanced': 0, 'expert': 0}
    years_found = []
    
    for context in contexts:
        # Check for level indicators
        for level, indicators in LEVEL_INDICATORS.items():
            for indicator in indicators:
                if indicator in context:
                    level_scores[level] += 1
        
        # Check for years of experience
        years = extract_years_from_context(context)
        if years:
            years_found.extend(years)
    
    # Determine level from scores
    if sum(level_scores.values()) == 0:
        # No explicit level indicators - infer from years
        avg_years = max(years_found) if years_found else None
        level = infer_level_from_years(avg_years)
        confidence = 0.5 if years_found else 0.3
    else:
        # Get highest scoring level
        level = max(level_scores.items(), key=lambda x: x[1])[0]
        confidence = min(1.0, sum(level_scores.values()) / len(contexts) / 2)
    
    # Get representative years value
    years_value = max(years_found) if years_found else None
    
    # Adjust level based on years if needed
    if years_value:
        inferred_level = infer_level_from_years(years_value)
        # If years suggest higher level, upgrade
        level_hierarchy = ['beginner', 'intermediate', 'advanced', 'expert']
        if level_hierarchy.index(inferred_level) > level_hierarchy.index(level):
            level = inferred_level
            confidence = max(confidence, 0.7)
    
    return SkillLevel(
        skill=skill,
        level=level,
        years=years_value,
        confidence=round(confidence, 2)
    )


def extract_skill_contexts(text: str, skill: str, window: int = 100) -> List[str]:
    """Extract text contexts around skill mentions (±window characters)"""
    contexts = []
    
    # Find all occurrences of the skill
    pattern = r'\b' + re.escape(skill) + r'\b'
    
    for match in re.finditer(pattern, text, re.IGNORECASE):
        start = max(0, match.start() - window)
        end = min(len(text), match.end() + window)
        context = text[start:end]
        contexts.append(context)
    
    return contexts


def extract_years_from_context(context: str) -> List[int]:
    """Extract years of experience from context"""
    years = []
    
    for pattern in YEARS_PATTERNS:
        matches = re.findall(pattern, context, re.IGNORECASE)
        for match in matches:
            if isinstance(match, tuple):
                # Range like "2-4 years" - take the maximum
                years.append(max(int(m) for m in match if m.isdigit()))
            elif match.isdigit():
                years.append(int(match))
    
    return years


def infer_level_from_years(years: Optional[int]) -> str:
    """Infer skill level from years of experience"""
    if years is None:
        return 'beginner'
    elif years < 1:
        return 'beginner'
    elif years < 3:
        return 'intermediate'
    elif years < 5:
        return 'advanced'
    else:
        return 'expert'


def detect_all_skill_levels(resume_text: str, skills: List[str]) -> Dict[str, SkillLevel]:
    """
    Detect proficiency levels for all skills.
    
    Returns dict: {skill_name: SkillLevel}
    """
    logger.debug(f"Detecting skill levels for {len(skills)} skills")
    
    skill_levels = {}
    
    for skill in skills:
        level_info = detect_skill_level(resume_text, skill)
        skill_levels[skill] = level_info
    
    logger.info(f"✅ Detected levels for {len(skill_levels)} skills")
    
    return skill_levels


def get_skill_level_summary(skill_levels: Dict[str, SkillLevel]) -> Dict:
    """
    Generate summary statistics for skill levels.
    
    Returns distribution and insights.
    """
    level_counts = {'beginner': 0, 'intermediate': 0, 'advanced': 0, 'expert': 0}
    total_years = []
    high_confidence = []
    
    for skill, level_info in skill_levels.items():
        level_counts[level_info.level] += 1
        
        if level_info.years:
            total_years.append(level_info.years)
        
        if level_info.confidence >= 0.7:
            high_confidence.append(skill)
    
    avg_years = sum(total_years) / len(total_years) if total_years else None
    
    return {
        'distribution': level_counts,
        'total_skills': len(skill_levels),
        'average_years': round(avg_years, 1) if avg_years else None,
        'high_confidence_skills': high_confidence,
        'expert_skills': [s for s, l in skill_levels.items() if l.level == 'expert'],
        'advanced_skills': [s for s, l in skill_levels.items() if l.level == 'advanced']
    }


def format_skill_with_level(skill: str, level_info: SkillLevel) -> str:
    """Format skill with level information for display"""
    parts = [skill]
    
    if level_info.years:
        parts.append(f"{level_info.years}+ yrs")
    
    parts.append(f"({level_info.level})")
    
    return " - ".join(parts)
