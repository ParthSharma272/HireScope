# backend/core/scoring.py
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
    t = text.lower()
    has_contact = ("@" in t) or ("email" in t)
    has_exp = ("experience" in t) or ("work experience" in t) or ("projects" in t)
    has_edu = ("education" in t) or ("bachelor" in t) or ("master" in t) or ("b.sc" in t)
    score = (1.0*has_contact + 1.0*has_exp + 1.0*has_edu) / 3.0
    return float(score)

def readability_score(text: str):
    # simplified proxy: average sentence length inverse
    sentences = [s for s in text.split('.') if s.strip()]
    if not sentences:
        return 0.5
    avg_len = sum(len(s.split()) for s in sentences) / len(sentences)
    # map avg_len to [0,1] with 12 words as ideal
    score = max(0.0, min(1.0, 1 - abs(avg_len-12)/30))
    return float(score)

def tone_score(text: str):
    # heuristic: action verbs count / sentence count
    verbs = ["led","developed","built","designed","implemented","created","managed","optimized","deployed"]
    count = sum(text.lower().count(v) for v in verbs)
    sentences = max(1, len([s for s in text.split('.') if s.strip()]))
    score = min(1.0, count / (0.5*sentences + 1e-10))
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
