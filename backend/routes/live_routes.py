# backend/routes/live_routes.py
from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import JSONResponse
from core.preprocess import segment_text, sentence_split_with_offsets
from core.embedding_store import embed_texts, embed_sentences, get_model
from core.keyword_match import compute_keyword_match, simple_keywords_from_jd
from core.scoring import compute_scores_with_role
from core.insights import generate_insight, generate_advanced_suggestions
from core.skill_detection import detect_all_skill_levels, get_skill_level_summary
from core.weighted_matching import extract_weighted_keywords, compute_weighted_match_score
from core.rag_engine import get_rag_engine
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/live", tags=["live"])

@router.post("/live-analyze")
async def live_analyze(resume_text: str = Form(...), job_description: str = Form("")):
    """
    Fast analysis endpoint optimized for live editing.
    Skips some heavy operations for speed.
    """
    if not resume_text or len(resume_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Resume text too short")
    
    try:
        # Quick segmentation
        sections = segment_text(resume_text)
        sentences_with_offsets = sentence_split_with_offsets(resume_text)
        sentences = [s["sentence"] for s in sentences_with_offsets]
        
        # Embeddings (cached model)
        model = get_model()
        doc_embedding = embed_texts([resume_text], model=model)[0]
        sentence_embeddings = embed_sentences(sentences, model=model)
        
        # Keyword analysis
        keyword_stats = compute_keyword_match(resume_text, job_description or "")
        
        # NEW: Skill level detection (lightweight for live)
        skill_levels = {}
        skill_summary = {}
        if job_description and keyword_stats.get('matches'):
            try:
                skill_levels = detect_all_skill_levels(resume_text, keyword_stats['matches'][:10])  # Limit to top 10 for speed
                skill_summary = get_skill_level_summary(skill_levels)
            except Exception as e:
                logger.warning(f"Live skill detection failed: {e}")
        
        # NEW: Weighted matching (cached JD extraction for speed)
        weighted_match = {}
        if job_description:
            try:
                weighted_keywords = extract_weighted_keywords(job_description, simple_keywords_from_jd)
                weighted_match = compute_weighted_match_score(
                    resume_text,
                    weighted_keywords,
                    skill_levels={sl.skill: sl for sl in skill_levels.values()} if skill_levels else None
                )
            except Exception as e:
                logger.warning(f"Live weighted matching failed: {e}")
        
        # Scoring
        scores = compute_scores_with_role(
            resume_text,
            keyword_stats,
            doc_embedding,
            sentence_embeddings,
            job_description or ""
        )
        
        # Update composite score with weighted match
        if weighted_match and 'overall_score' in weighted_match:
            scores['weighted_keyword_score'] = weighted_match['overall_score']
            scores['composite'] = (
                scores['composite'] * 0.7 +
                weighted_match['overall_score'] * 0.3
            )
        
        # Quick insight (no LLM for speed)
        insight = generate_insight(resume_text, job_description or "", scores)
        
        # OPTIONAL: Advanced AI suggestions for live feedback (lightweight mode)
        # Only generate if JD is provided and scores are calculated
        ai_suggestions_summary = None
        if job_description and scores.get('composite', 0) < 0.7:
            try:
                # Generate quick suggestions focusing on top issues only
                ai_suggestions = generate_advanced_suggestions(
                    resume_text=resume_text,
                    jd_text=job_description,
                    scores=scores,
                    keyword_stats=keyword_stats,
                    skill_levels=skill_levels,
                    weighted_match=weighted_match
                )
                # Return condensed version for live UI
                ai_suggestions_summary = {
                    "quick_wins": ai_suggestions.get("quick_wins", [])[:3],
                    "critical_count": len(ai_suggestions.get("action_items", {}).get("critical", [])),
                    "overall_grade": ai_suggestions.get("summary", {}).get("overall_grade", "N/A"),
                    "estimated_time": ai_suggestions.get("summary", {}).get("estimated_time_to_improve", "N/A")
                }
            except Exception as e:
                logger.warning(f"Live AI suggestions failed: {e}")
        
        return JSONResponse({
            "scores": scores,
            "keywords": keyword_stats,
            "skill_levels": {
                skill: {
                    'level': info.level,
                    'years': info.years,
                    'confidence': info.confidence
                } for skill, info in skill_levels.items()
            } if skill_levels else {},
            "skill_summary": skill_summary,
            "weighted_match": weighted_match,
            "insight": insight,
            "ai_suggestions_summary": ai_suggestions_summary,  # Quick feedback for live editing
            "word_count": len(resume_text.split()),
            "sections": list(sections.keys())
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")
