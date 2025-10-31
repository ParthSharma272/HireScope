# backend/core/embedding_store.py
from sentence_transformers import SentenceTransformer
import numpy as np
import threading

_MODEL = None
_MODEL_LOCK = threading.Lock()

def get_model(name: str = "all-mpnet-base-v2"):
    global _MODEL
    if _MODEL is None:
        with _MODEL_LOCK:
            if _MODEL is None:
                _MODEL = SentenceTransformer(name)
    return _MODEL

def embed_texts(texts, model=None):
    model = model or get_model()
    vecs = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    # Normalize rows
    norms = np.linalg.norm(vecs, axis=1, keepdims=True) + 1e-10
    return (vecs / norms).astype(np.float32)

def embed_sentences(sentences, model=None):
    return embed_texts(sentences, model=model)
