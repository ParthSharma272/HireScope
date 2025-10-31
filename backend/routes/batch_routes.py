"""
Batch Resume Analysis Routes
Analyze multiple resumes against a single job description
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
import io
from core.parsing import extract_text_from_file
from core.preprocess import segment_text
from core.keyword_match import compute_keyword_match
from core.scoring import compute_scores_with_role
from core.skill_detection import detect_all_skill_levels, get_skill_level_summary
from core.embedding_store import embed_texts, get_model

router = APIRouter(prefix="/api/batch", tags=["batch"])


@router.post("/analyze")
async def batch_analyze_resumes(
    resume_files: List[UploadFile] = File(...),
    job_description: str = Form(...)
):
    """
    Analyze multiple resumes against a single job description
    Returns comparison data with scores for all resumes
    """
    try:
        if not resume_files:
            raise HTTPException(status_code=400, detail="No resume files provided")
        
        if len(resume_files) > 10:
            raise HTTPException(
                status_code=400, 
                detail="Maximum 10 resumes can be analyzed at once"
            )
        
        if not job_description or len(job_description.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Job description is required and must be at least 50 characters"
            )
        
        results = []
        model = get_model()  # Load embedding model once
        
        for idx, file in enumerate(resume_files):
            try:
                # Read file content
                file_content = await file.read()
                
                # Extract text
                resume_text, _, _ = extract_text_from_file(file_content, file.filename)
                
                if not resume_text or len(resume_text.strip()) < 100:
                    results.append({
                        "filename": file.filename,
                        "status": "error",
                        "error": "Could not extract text from resume or resume is too short",
                        "overall_score": 0
                    })
                    continue
                
                # Perform keyword matching
                keyword_stats = compute_keyword_match(resume_text, job_description)
                
                # Detect skills
                skill_levels = {}
                if keyword_stats.get('matches'):
                    try:
                        skill_levels = detect_all_skill_levels(resume_text, keyword_stats['matches'])
                    except:
                        pass
                
                # Compute embeddings for scoring
                doc_embedding = embed_texts([resume_text], model=model)[0]
                
                # Calculate scores
                sections = segment_text(resume_text)
                scores = compute_scores_with_role(
                    resume_text,
                    keyword_stats,
                    doc_embedding,
                    [],  # We don't need sentence embeddings for batch
                    sections,
                    job_description
                )
                
                overall_score = scores.get('overall', 0)
                
                # Extract key metrics
                word_count = len(resume_text.split())
                skills_count = len(skill_levels)
                
                # Determine rank indicator
                if overall_score >= 85:
                    rank = "Excellent"
                    rank_color = "green"
                elif overall_score >= 70:
                    rank = "Good"
                    rank_color = "blue"
                elif overall_score >= 50:
                    rank = "Fair"
                    rank_color = "yellow"
                else:
                    rank = "Needs Improvement"
                    rank_color = "red"
                
                results.append({
                    "filename": file.filename,
                    "status": "success",
                    "overall_score": round(overall_score, 1),
                    "keyword_score": round(scores.get('keyword_relevance', 0), 1),
                    "skills_count": skills_count,
                    "word_count": word_count,
                    "rank": rank,
                    "rank_color": rank_color,
                    "top_skills": list(skill_levels.keys())[:5] if skill_levels else [],
                    "analysis_id": f"batch_{idx+1}"
                })
                
            except Exception as e:
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "error": f"Error processing file: {str(e)}",
                    "overall_score": 0
                })
        
        # Sort results by overall score (highest first)
        results.sort(key=lambda x: x.get("overall_score", 0), reverse=True)
        
        # Add ranking numbers
        rank_number = 1
        for result in results:
            if result["status"] == "success":
                result["position"] = rank_number
                rank_number += 1
            else:
                result["position"] = None
        
        # Calculate statistics
        successful_analyses = [r for r in results if r["status"] == "success"]
        stats = {
            "total_resumes": len(resume_files),
            "successful_analyses": len(successful_analyses),
            "failed_analyses": len(resume_files) - len(successful_analyses),
            "average_score": round(
                sum(r["overall_score"] for r in successful_analyses) / len(successful_analyses)
                if successful_analyses else 0,
                1
            ),
            "highest_score": max(
                (r["overall_score"] for r in successful_analyses),
                default=0
            ),
            "lowest_score": min(
                (r["overall_score"] for r in successful_analyses),
                default=0
            )
        }
        
        return {
            "success": True,
            "job_description_preview": job_description[:200] + "..." if len(job_description) > 200 else job_description,
            "results": results,
            "statistics": stats,
            "message": f"Analyzed {len(successful_analyses)} resumes successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")


@router.get("/health")
async def batch_health():
    """Health check for batch analysis endpoint"""
    return {
        "status": "healthy",
        "service": "batch_analysis",
        "max_files": 10
    }
