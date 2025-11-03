#!/usr/bin/env python3
"""
Download and verify models during Docker build
"""
import time
from sentence_transformers import SentenceTransformer
import spacy

def download_sentence_transformer():
    """Download sentence-transformers model with retry logic"""
    model_name = 'all-mpnet-base-v2'
    max_attempts = 3
    
    for attempt in range(max_attempts):
        try:
            print(f"\n{'='*60}")
            print(f"Downloading {model_name} (attempt {attempt+1}/{max_attempts})...")
            print(f"{'='*60}\n")
            
            model = SentenceTransformer(model_name)
            
            print(f"\n{'='*60}")
            print(f"✅ Model downloaded successfully!")
            print(f"Model path: {model_name}")
            print(f"{'='*60}\n")
            
            # Verify model works
            test_embedding = model.encode("test sentence")
            print(f"✅ Model verification passed (embedding dim: {len(test_embedding)})")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Download failed: {e}")
            if attempt < max_attempts - 1:
                print(f"⏳ Retrying in 5 seconds...\n")
                time.sleep(5)
            else:
                print(f"\n❌ All attempts failed!")
                raise

def verify_spacy():
    """Verify spaCy model is installed"""
    try:
        print(f"\n{'='*60}")
        print("Verifying spaCy model...")
        print(f"{'='*60}\n")
        
        nlp = spacy.load("en_core_web_sm")
        doc = nlp("This is a test sentence.")
        
        print(f"✅ spaCy model verified (tokens: {len(doc)})")
        print(f"{'='*60}\n")
        
        return True
    except Exception as e:
        print(f"❌ spaCy verification failed: {e}")
        raise

if __name__ == "__main__":
    print("\n" + "="*60)
    print("DOWNLOADING AND VERIFYING MODELS")
    print("="*60 + "\n")
    
    # Download sentence-transformers model
    download_sentence_transformer()
    
    # Verify spaCy model
    verify_spacy()
    
    print("\n" + "="*60)
    print("✅ ALL MODELS READY!")
    print("="*60 + "\n")
