#!/usr/bin/env python3
"""
Warmup script to pre-load models and ensure they're cached properly.
This runs before the main application starts.
"""

import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def warmup_models():
    """Pre-load all models to ensure they're cached and ready"""
    try:
        logger.info("Starting model warmup...")
        
        # 1. Load sentence-transformers model
        logger.info("Loading sentence-transformers model...")
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('all-mpnet-base-v2')
        logger.info(f"✓ Sentence-transformers model loaded successfully")
        
        # 2. Test embedding generation
        logger.info("Testing embedding generation...")
        test_text = ["This is a test sentence"]
        embeddings = model.encode(test_text)
        logger.info(f"✓ Embeddings generated successfully: shape={embeddings.shape}")
        
        # 3. Load spaCy model
        logger.info("Loading spaCy model...")
        import spacy
        nlp = spacy.load('en_core_web_sm')
        logger.info("✓ spaCy model loaded successfully")
        
        # 4. Test spaCy processing
        logger.info("Testing spaCy processing...")
        doc = nlp("Test document")
        logger.info(f"✓ spaCy processing successful")
        
        logger.info("=" * 60)
        logger.info("✓ All models warmed up successfully!")
        logger.info("=" * 60)
        return True
        
    except Exception as e:
        logger.error(f"✗ Warmup failed: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    success = warmup_models()
    sys.exit(0 if success else 1)
