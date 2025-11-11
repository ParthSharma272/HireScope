import re
import numpy as np
from .keyword_match import compute_keyword_match

ROLE_WEIGHTS = {
    "TECH": {"structural":0.20, "semantic":0.45, "keyword":0.25, "readability":0.05, "tone":0.05},
    "MANAGER": {"structural":0.25, "semantic":0.30, "keyword":0.15, "readability":0.15, "tone":0.15},
    "CREATIVE": {"structural":0.20, "semantic":0.25, "keyword":0.10, "readability":0.20, "tone":0.25},
    "GENERAL": {"structural":0.25, "semantic":0.35, "keyword":0.25, "readability":0.10, "tone":0.05}
}

def detect_role_from_jd(jd_text: str):
    if not jd_text:
        return "GENERAL"
    jd = jd_text.lower()
    tech_words = ["engineer","developer","python","ml","machine learning","data scientist","backend","frontend","react","node"]
    mgmt_words = ["manager","lead","head of","director","senior manager","product manager"]
    creative_words = ["designer","creative","ux","ui","visual","copywriter"]
    if any(w in jd for w in tech_words): return "TECH"
    if any(w in jd for w in mgmt_words): return "MANAGER"
    if any(w in jd for w in creative_words): return "CREATIVE"
    return "GENERAL"

def structural_score(text: str):
    """
    Improved structural score checking 6 key resume components.
    Based on ATS best practices: contact, experience, education, skills, summary, headers.
    """
    t = text.lower()
    score = 0.0
    
    # 1. Contact Information (20%) - Must have email or phone
    has_contact = ("@" in t) or ("email" in t) or re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', t)
    if has_contact:
        score += 0.20
    
    # 2. Experience Section (25%) - Most critical for ATS
    has_experience = any(keyword in t for keyword in [
        "experience", "work experience", "professional experience", 
        "employment", "work history"
    ])
    if has_experience:
        score += 0.25
    
    # 3. Education Section (15%) - Standard requirement
    has_education = any(keyword in t for keyword in [
        "education", "bachelor", "master", "b.sc", "b.tech", 
        "mba", "degree", "university", "college"
    ])
    if has_education:
        score += 0.15
    
    # 4. Skills Section (20%) - Critical for ATS keyword matching
    has_skills = any(keyword in t for keyword in [
        "skills", "technical skills", "core competencies", 
        "expertise", "proficiencies"
    ])
    if has_skills:
        score += 0.20
    
    # 5. Professional Summary (10%) - Shows intentional writing
    has_summary = any(keyword in t for keyword in [
        "summary", "profile", "objective", "about me", 
        "professional summary", "career summary"
    ])
    if has_summary:
        score += 0.10
    
    # 6. Proper Section Headers (10%) - Indicates good structure
    # Count how many standard headers exist
    header_patterns = [
        r'\b(experience|work experience)\b',
        r'\b(education)\b',
        r'\b(skills|technical skills)\b',
        r'\b(projects)\b',
        r'\b(certifications?)\b'
    ]
    headers_found = sum(1 for pattern in header_patterns if re.search(pattern, t))
    if headers_found >= 3:  # At least 3 proper headers
        score += 0.10
    
    return float(min(1.0, score))  # Cap at 1.0

def readability_score(text: str):
    """
    Improved readability based on optimal bullet length (15 words).
    Resume bullets should be 10-20 words for clarity.
    """
    sentences = [s for s in text.split('.') if s.strip()]
    if not sentences:
        return 0.5
    
    avg_len = sum(len(s.split()) for s in sentences) / len(sentences)
    
    # Optimal: 15 words per sentence/bullet (changed from 12)
    # Penalty factor: 20 (changed from 30 for stricter scoring)
    ideal_length = 15
    penalty_factor = 20
    
    score = max(0.0, min(1.0, 1 - abs(avg_len - ideal_length) / penalty_factor))
    return float(score)

def tone_score(text: str):
    """
    Improved tone score using word boundary matching to avoid false positives.
    Targets 1.2 action verbs per bullet (changed from 0.5 per sentence).
    """
    # Expanded action verb list (common resume verbs)
    verbs = [
        "led", "developed", "built", "designed", "implemented", "created",
        "managed", "optimized", "deployed", "achieved", "improved", "increased",
        "reduced", "launched", "delivered", "established", "coordinated",
        "analyzed", "executed", "streamlined", "spearheaded", "drove",
        "initiated", "facilitated", "mentored", "collaborated", "engineered"
    ]
    
    # Use word boundaries to avoid false matches (e.g., "detailed" won't match "led")
    count = sum(len(re.findall(rf'\b{verb}\b', text.lower())) for verb in verbs)
    
    # Count bullets (periods) instead of sentences for more accurate bullet-based scoring
    bullets = max(1, len([s for s in text.split('.') if s.strip()]))
    
    # Target: 1.2 action verbs per bullet (changed from 0.5)
    # This means excellent resumes should have 1+ verb per bullet
    target_ratio = 1.2
    verbs_per_bullet = count / bullets
    
    # Score: ratio / target, capped at 1.0
    score = min(1.0, verbs_per_bullet / target_ratio)
    
    return float(score)

def semantic_score_from_doc_and_sentences(doc_embedding, sentence_embeddings, jd_embedding=None):
    """
    If jd_embedding is provided, compute similarity between doc / sentences and JD.
    If no jd_embedding, we can compute internal coherence or return 0.
    """
    if jd_embedding is None:
        return 0.0
    
    # dot product because embeddings normalized
    # approach: top-k sentence similarity average
    sims = sentence_embeddings @ jd_embedding
    topk = min(5, len(sims))
    topk_avg = float(np.mean(np.sort(sims)[-topk:])) if len(sims)>0 else float(np.dot(doc_embedding, jd_embedding))
    
    # clamp 0..1
    return float(max(0.0, min(1.0, topk_avg)))

def compute_scores_with_role(raw_text, keyword_stats, doc_embedding, sentence_embeddings, jd_text=""):
    role = detect_role_from_jd(jd_text)
    weights = ROLE_WEIGHTS.get(role, ROLE_WEIGHTS["GENERAL"])
    
    # components
    structural = structural_score(raw_text)
    
    keyword = 0.0
    if keyword_stats and keyword_stats.get("required",0) > 0:
        keyword = keyword_stats["matched"] / max(1, keyword_stats["required"])
    
    readability = readability_score(raw_text)
    tone = tone_score(raw_text)
    
    semantic = 0.0
    if jd_text:
        from .embedding_store import embed_texts
        jd_emb = embed_texts([jd_text])[0]
        semantic = semantic_score_from_doc_and_sentences(doc_embedding, sentence_embeddings, jd_emb)
    
    # composite
    composite = (weights["structural"]*structural +
                 weights["semantic"]*semantic +
                 weights["keyword"]*keyword +
                 weights["readability"]*readability +
                 weights["tone"]*tone)
    
    # scale to 0..1
    out = {
        "role": role,
        "structural": round(structural, 3),
        "keyword": round(keyword, 3),
        "semantic": round(semantic, 3),
        "readability": round(readability, 3),
        "tone": round(tone, 3),
        "composite": round(float(composite), 3)
    }
    
    return out
