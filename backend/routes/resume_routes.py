# backend/routes/resume_routes.py
import io
import logging
import traceback
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from core.parsing import extract_text_from_file
from core.preprocess import segment_text, sentence_split_with_offsets
from core.embedding_store import embed_texts, embed_sentences, get_model
from core.keyword_match import compute_keyword_match
from core.scoring import compute_scores_with_role
from core.insights import generate_insight, generate_advanced_suggestions
from core.rag_engine import get_rag_engine
from core.skill_detection import detect_all_skill_levels, get_skill_level_summary
from core.weighted_matching import extract_weighted_keywords, compute_weighted_match_score
from core.keyword_match import simple_keywords_from_jd
from utils.common import hash_bytes

# Optional: PDF report generation (requires WeasyPrint system dependencies)
try:
    from core.report import render_pdf_report
    PDF_REPORTS_AVAILABLE = True
except (ImportError, OSError) as e:
    logger.warning(f"PDF report generation not available: {e}")
    PDF_REPORTS_AVAILABLE = False
    render_pdf_report = None

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/resume", tags=["resume"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), job_description: str = Form(None)):
    try:
        logger.info(f"Received upload request for file: {file.filename}")
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # 1) Extract text
        logger.info("Extracting text from file...")
        try:
            raw_text, pages, metadata = extract_text_from_file(content, file.filename)
            logger.info(f"Text extracted successfully. Length: {len(raw_text)}")
        except Exception as e:
            logger.error(f"Parsing error: {e}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Parsing error: {e}")

        # 2) Segment and sentence-split (with offsets)
        logger.info("Segmenting text...")
        sections = segment_text(raw_text)
        sentences_with_offsets = sentence_split_with_offsets(raw_text)  # list of dicts: {sent, start, end}
        sentences = [s["sentence"] for s in sentences_with_offsets]
        logger.info(f"Found {len(sentences)} sentences")

        # 3) Embeddings
        logger.info("Loading embedding model...")
        model = get_model()  # ensures model is loaded once
        logger.info("Computing embeddings...")
        doc_embedding = embed_texts([raw_text], model=model)[0]
        sentence_embeddings = embed_sentences(sentences, model=model)
        logger.info("Embeddings computed successfully")

        # 4) Keyword match (basic)
        logger.info("Computing keyword match...")
        keyword_stats = compute_keyword_match(raw_text, job_description or "")
        
        # 4b) NEW: Skill level detection
        logger.info("Detecting skill levels...")
        skill_levels = {}
        skill_summary = {}
        if job_description and keyword_stats.get('matches'):
            try:
                skill_levels = detect_all_skill_levels(raw_text, keyword_stats['matches'])
                skill_summary = get_skill_level_summary(skill_levels)
                logger.info(f"✅ Skill levels detected: {len(skill_levels)} skills analyzed")
            except Exception as e:
                logger.warning(f"Skill detection failed: {e}")
        
        # 4c) NEW: Weighted keyword matching
        logger.info("Computing weighted keyword match...")
        weighted_match = {}
        if job_description:
            try:
                weighted_keywords = extract_weighted_keywords(job_description, simple_keywords_from_jd)
                weighted_match = compute_weighted_match_score(
                    raw_text, 
                    weighted_keywords,
                    skill_levels={sl.skill: sl for sl in skill_levels.values()} if skill_levels else None
                )
                logger.info(f"✅ Weighted match score: {weighted_match.get('overall_score', 0):.2%}")
            except Exception as e:
                logger.warning(f"Weighted matching failed: {e}")

        # 5) Scoring
        logger.info("Computing scores...")
        scores = compute_scores_with_role(
            raw_text,
            keyword_stats,
            doc_embedding,
            sentence_embeddings,
            job_description or ""
        )
        
        # 5b) Update composite score with weighted match if available
        if weighted_match and 'overall_score' in weighted_match:
            # Blend weighted keyword score with existing composite
            scores['weighted_keyword_score'] = weighted_match['overall_score']
            scores['composite'] = (
                scores['composite'] * 0.7 +  # Keep 70% of original
                weighted_match['overall_score'] * 0.3  # Add 30% weighted match
            )

        # 6) Heatmap (per-sentence similarity to JD)
        logger.info("Generating heatmap...")
        heatmap = []
        if job_description:
            jd_embedding = embed_texts([job_description], model=model)[0]
            import numpy as np
            # cosine similarity via dot after normalization done in embedding functions
            sims = (sentence_embeddings @ jd_embedding).tolist()
            for s, sim in zip(sentences_with_offsets, sims):
                heatmap.append({
                    "sentence": s["sentence"],
                    "score": float(sim),
                    "start": s["start"],
                    "end": s["end"]
                })
            # sort by score desc
            heatmap = sorted(heatmap, key=lambda x: x["score"], reverse=True)[:80]

        # 7) Insight generation (non-blocking improvement: background task)
        logger.info("Generating insights...")
        insight = generate_insight(raw_text, job_description or "", scores)
        
        # 8) Advanced AI suggestions (enhanced with multi-level recommendations)
        logger.info("Generating advanced AI suggestions...")
        try:
            advanced_suggestions = generate_advanced_suggestions(
                resume_text=raw_text,
                jd_text=job_description or "",
                scores=scores,
                keyword_stats=keyword_stats,
                skill_levels=skill_levels,
                weighted_match=weighted_match
            )
        except Exception as e:
            logger.warning(f"Advanced suggestions generation failed: {e}")
            logger.error(traceback.format_exc())
            advanced_suggestions = None
        
        # 9) RAG-powered suggestions (contextual tips from knowledge base)
        logger.info("Generating RAG suggestions...")
        try:
            rag_engine = get_rag_engine()
            rag_suggestions = rag_engine.generate_suggestions(raw_text, job_description or "", scores)
        except Exception as e:
            logger.warning(f"RAG suggestions failed: {e}")
            rag_suggestions = None

        # 10) Prepare response
        logger.info("Preparing response...")
        response = {
            "id": hash_bytes(content)[:12],
            "metadata": metadata,
            "sections": sections,
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
            "heatmap": heatmap,
            "insight": insight,
            "ai_suggestions": advanced_suggestions,  # New enhanced suggestions
            "rag_suggestions": rag_suggestions,
            "report_url": None
        }
        logger.info("Upload request completed successfully")
        return JSONResponse(response)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in upload processing: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@router.post("/report")
async def create_report(payload: dict):
    """
    Accepts the result JSON (like the response above) and returns a PDF streaming response.
    This endpoint is useful if you want backend-side PDF generation using WeasyPrint.
    Note: Requires WeasyPrint system dependencies (Pango, Cairo, etc.)
    """
    if not PDF_REPORTS_AVAILABLE:
        raise HTTPException(
            status_code=501, 
            detail="PDF report generation not available. Install WeasyPrint dependencies: brew install pango cairo"
        )
    
    try:
        pdf_bytes = render_pdf_report(payload)
        return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {e}")
