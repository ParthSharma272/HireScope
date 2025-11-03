# backend/core/embedding_store.py
from sentence_transformers import SentenceTransformer
import numpy as np
import threading
import time
import logging

logger = logging.getLogger(__name__)

_MODEL = None
_MODEL_LOCK = threading.Lock()

def get_model(name: str = "all-mpnet-base-v2", max_retries: int = 3):
    """
    Get or load the sentence transformer model with retry logic.
    
    Args:
        name: Model name from HuggingFace
        max_retries: Maximum number of retry attempts for network issues
    
    Returns:
        SentenceTransformer model instance
    """
    global _MODEL
    if _MODEL is None:
        with _MODEL_LOCK:
            if _MODEL is None:
                for attempt in range(max_retries):
                    try:
                        logger.info(f"Loading model '{name}' (attempt {attempt + 1}/{max_retries})...")
                        _MODEL = SentenceTransformer(name)
                        logger.info(f"Model '{name}' loaded successfully")
                        break
                    except Exception as e:
                        logger.error(f"Failed to load model (attempt {attempt + 1}/{max_retries}): {e}")
                        if attempt < max_retries - 1:
                            wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                            logger.info(f"Retrying in {wait_time} seconds...")
                            time.sleep(wait_time)
                        else:
                            logger.error("All retry attempts failed")
                            raise Exception(
                                f"Failed to load model '{name}' after {max_retries} attempts. "
                                "This may be due to network issues or cache permission problems. "
                                "Please check the logs and try again."
                            ) from e
    return _MODEL

def embed_texts(texts, model=None):
    model = model or get_model()
    vecs = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    # Normalize rows
    norms = np.linalg.norm(vecs, axis=1, keepdims=True) + 1e-10
    return (vecs / norms).astype(np.float32)

def embed_sentences(sentences, model=None):
    return embed_texts(sentences, model=model)
