# backend/app.py
import logging
import traceback
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from routes.resume_routes import router as resume_router
from routes.live_routes import router as live_router
from routes.ats_routes import router as ats_router
from routes.batch_routes import router as batch_router
from routes.template_routes import router as template_router
from utils.cache import get_cache_stats, clear_cache

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="HireScope Backend", version="2.0.0")

_FAVICON_PATH = Path(__file__).resolve().parent / "static" / "favicon.svg"

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

# CORS - Allow frontend from Vercel and localhost
origins = [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "https://*.vercel.app",  # All Vercel deployments
    "https://hirescope-frontend.vercel.app",  # Production frontend
    "https://*.hf.space",  # Hugging Face Spaces
    "https://arcadian27-hirescope-backend.hf.space",  # HF backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(live_router)
app.include_router(ats_router)
app.include_router(batch_router)
app.include_router(template_router)


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    """Serve favicon for browsers requesting /favicon.ico."""
    if _FAVICON_PATH.exists():
        return FileResponse(str(_FAVICON_PATH), media_type="image/svg+xml")
    return JSONResponse(status_code=404, content={"detail": "Favicon not found"})

@app.get("/")
def root():
    """Root endpoint - redirects to API docs"""
    return {
        "message": "HireScope Backend API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
def health():
    """Basic health check endpoint"""
    return {"status": "ok", "version": "2.0.0"}

@app.get("/api/health/detailed")
def detailed_health():
    """Detailed health check with cache stats"""
    from core.keyword_match import get_embedding_model
    
    cache_stats = get_cache_stats()
    model_loaded = get_embedding_model() is not None
    
    return {
        "status": "healthy",
        "version": "2.0.0",
        "embedding_model_loaded": model_loaded,
        "cache": cache_stats,
        "features": {
            "caching": True,
            "lazy_loading": True,
            "skill_detection": True,
            "weighted_matching": True,
            "advanced_ai_suggestions": True,
            "ats_compatibility_check": True,
            "gap_analysis": True,
            "competitive_intelligence": True
        }
    }

@app.post("/api/admin/cache/clear")
def clear_cache_endpoint(pattern: str = None):
    """
    Clear cache entries (admin endpoint).
    
    - pattern: Optional pattern to match (e.g., "jd_keywords" to clear only JD keyword cache)
    - If no pattern provided, clears all cache
    """
    try:
        clear_cache(pattern)
        return {
            "status": "success",
            "message": f"Cache cleared: {pattern or 'all'}",
            "stats": get_cache_stats()
        }
    except Exception as e:
        logger.error(f"Cache clear error: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

@app.get("/api/admin/cache/stats")
def cache_stats_endpoint():
    """Get cache statistics (admin endpoint)"""
    return get_cache_stats()
