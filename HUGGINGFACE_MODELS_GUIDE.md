# Hugging Face Model Examples for HireScope

## Quick Reference: Best Models by Use Case

### 📝 Text Generation / Resume Rewriting
```python
# Option 1: Mistral 7B (Best balance of quality/speed)
model = "mistralai/Mistral-7B-Instruct-v0.2"

# Option 2: Llama 2 (Strong general purpose)
model = "meta-llama/Llama-2-7b-chat-hf"

# Option 3: Flan-T5 (Lighter, good for CPU)
model = "google/flan-t5-xl"
```

### 🔍 Embeddings / Semantic Search
```python
# Option 1: BGE Large (Best overall)
model = "BAAI/bge-large-en-v1.5"

# Option 2: E5 Large (Excellent retrieval)
model = "intfloat/e5-large-v2"

# Option 3: Instructor (Instruction-based)
model = "hkunlp/instructor-xl"

# Current: all-mpnet (Good baseline) ✅
model = "sentence-transformers/all-mpnet-base-v2"
```

### 🎯 Named Entity Recognition (Skills Extraction)
```python
# Option 1: JobBERT (Resume-specific)
model = "jjzha/jobbert_skill_extraction"

# Option 2: General NER
model = "dslim/bert-base-NER"
```

### 📄 Document Understanding
```python
# LayoutLM (Best for structured docs)
model = "microsoft/layoutlmv3-base"

# UDOP (Unified document understanding)
model = "microsoft/udop-large"
```

### 🔤 OCR Text Detection
```python
# EasyOCR (Multi-language, easy setup)
# No model string needed - installed as package

# PaddleOCR (Faster, Chinese company)
# No model string needed - installed as package

# TrOCR (Transformer-based OCR)
model = "microsoft/trocr-large-printed"
```

---

## Complete Working Examples

### Example 1: Resume Bullet Point Rewriter

```python
# backend/core/llm_rewriter.py
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class ResumeRewriter:
    def __init__(self):
        model_name = "mistralai/Mistral-7B-Instruct-v0.2"
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,  # Use half precision
            device_map="auto",           # Auto GPU/CPU allocation
            load_in_8bit=True           # 8-bit quantization (saves memory)
        )
    
    def rewrite(self, text: str, context: str = "") -> str:
        prompt = f"""[INST] Rewrite this resume bullet point to be more ATS-friendly and impactful:

"{text}"

{f'Context: {context}' if context else ''}

Requirements:
- Start with a strong action verb
- Include metrics if possible
- Use industry keywords
- Keep it concise

Rewritten: [/INST]"""
        
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        outputs = self.model.generate(
            **inputs,
            max_new_tokens=100,
            temperature=0.7,
            do_sample=True,
            top_p=0.9
        )
        
        result = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return result.split("[/INST]")[-1].strip()

# Usage:
rewriter = ResumeRewriter()
original = "Worked on machine learning projects"
improved = rewriter.rewrite(original, "software engineering role")
# Output: "Developed and deployed 5+ ML models achieving 90%+ accuracy..."
```

### Example 2: Skill Extractor with NER

```python
# backend/core/skill_extractor.py
from transformers import pipeline

class SkillExtractor:
    def __init__(self):
        self.ner = pipeline(
            "ner",
            model="jjzha/jobbert_skill_extraction",
            aggregation_strategy="simple"
        )
    
    def extract_skills(self, text: str) -> dict:
        """Extract technical and soft skills"""
        entities = self.ner(text)
        
        technical_skills = []
        soft_skills = []
        
        for entity in entities:
            skill_text = entity['word'].strip()
            confidence = entity['score']
            
            if confidence > 0.7:  # Filter low confidence
                # Categorize (this is simplified - you can make it smarter)
                if any(tech in skill_text.lower() for tech in 
                       ['python', 'java', 'sql', 'docker', 'aws']):
                    technical_skills.append({
                        'name': skill_text,
                        'confidence': confidence
                    })
                else:
                    soft_skills.append({
                        'name': skill_text,
                        'confidence': confidence
                    })
        
        return {
            'technical': technical_skills,
            'soft': soft_skills,
            'total_count': len(entities)
        }

# Usage:
extractor = SkillExtractor()
skills = extractor.extract_skills("Expert in Python, Docker, and team leadership")
# Output: {'technical': [{'name': 'Python', 'confidence': 0.95}, ...]}
```

### Example 3: Advanced RAG with LangChain

```python
# backend/core/advanced_rag.py
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFaceHub
import os

class AdvancedRAG:
    def __init__(self):
        # Better embeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name="BAAI/bge-large-en-v1.5",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        
        # LLM for generation
        self.llm = HuggingFaceHub(
            repo_id="mistralai/Mistral-7B-Instruct-v0.2",
            model_kwargs={"temperature": 0.7, "max_length": 512},
            huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_TOKEN")
        )
        
        # Vector store
        self.vector_store = None
        self.qa_chain = None
    
    def index_documents(self, documents: list[str]):
        """Index resume tips, job descriptions, etc."""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        
        splits = text_splitter.create_documents(documents)
        self.vector_store = FAISS.from_documents(splits, self.embeddings)
        
        # Create QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3})
        )
    
    def get_suggestions(self, query: str) -> str:
        """Get AI-powered suggestions"""
        if not self.qa_chain:
            return "Please index documents first"
        
        return self.qa_chain.run(query)

# Usage:
rag = AdvancedRAG()

# Index knowledge base
documents = [
    "Use action verbs like 'Led', 'Developed', 'Implemented'",
    "Quantify achievements with specific metrics",
    "Tailor resume keywords to job description"
]
rag.index_documents(documents)

# Get suggestions
suggestion = rag.get_suggestions(
    "How can I improve my software engineer resume?"
)
```

### Example 4: OCR with EasyOCR

```python
# backend/core/advanced_ocr.py
import easyocr
import cv2
import numpy as np
from PIL import Image
import io

class AdvancedOCR:
    def __init__(self, languages=['en']):
        """Initialize EasyOCR - downloads models on first run"""
        self.reader = easyocr.Reader(languages, gpu=False)
    
    def extract_from_bytes(self, image_bytes: bytes) -> dict:
        """Extract text from image bytes"""
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)
        
        # Extract text with bounding boxes
        results = self.reader.readtext(image_array, detail=1)
        
        # Format results
        extracted = {
            'full_text': '',
            'blocks': []
        }
        
        for (bbox, text, confidence) in results:
            extracted['full_text'] += text + ' '
            extracted['blocks'].append({
                'text': text,
                'confidence': float(confidence),
                'bbox': [[int(p[0]), int(p[1])] for p in bbox]
            })
        
        return extracted
    
    def preprocess_image(self, image_array: np.ndarray) -> np.ndarray:
        """Enhance image quality for better OCR"""
        # Convert to grayscale
        gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(gray, h=10)
        
        # Increase contrast
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(denoised)
        
        # Threshold
        _, binary = cv2.threshold(
            enhanced, 0, 255, 
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )
        
        return binary

# Usage:
ocr = AdvancedOCR()

# From PDF page image
from pdf2image import convert_from_bytes
pdf_bytes = open("resume.pdf", "rb").read()
images = convert_from_bytes(pdf_bytes)

for img in images:
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    result = ocr.extract_from_bytes(img_bytes.getvalue())
    print(result['full_text'])
```

### Example 5: Better Embeddings with Instructions

```python
# backend/core/instructed_embeddings.py
from sentence_transformers import SentenceTransformer
import numpy as np

class InstructedEmbeddings:
    def __init__(self, model_name="BAAI/bge-large-en-v1.5"):
        self.model = SentenceTransformer(model_name)
    
    def embed_resume(self, resume_text: str):
        """Embed resume with specific instruction"""
        instruction = "Represent this resume for job matching"
        return self.model.encode(
            [f"{instruction}: {resume_text}"],
            normalize_embeddings=True
        )[0]
    
    def embed_job_description(self, jd_text: str):
        """Embed JD with specific instruction"""
        instruction = "Represent this job description for candidate matching"
        return self.model.encode(
            [f"{instruction}: {jd_text}"],
            normalize_embeddings=True
        )[0]
    
    def compute_similarity(self, resume_text: str, jd_text: str) -> float:
        """Compute similarity with instructed embeddings"""
        resume_emb = self.embed_resume(resume_text)
        jd_emb = self.embed_job_description(jd_text)
        
        # Cosine similarity
        similarity = np.dot(resume_emb, jd_emb)
        return float(similarity)

# Usage:
embedder = InstructedEmbeddings()
similarity = embedder.compute_similarity(
    resume_text="Python developer with ML experience...",
    jd_text="Looking for ML engineer with Python skills..."
)
print(f"Match: {similarity * 100:.1f}%")
```

---

## Model Comparison

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| all-MiniLM-L6-v2 | 80MB | ⚡⚡⚡ | ⭐⭐⭐ | Current default |
| bge-large-en-v1.5 | 1.3GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | Best embeddings |
| Mistral-7B | 14GB | ⚡ | ⭐⭐⭐⭐⭐ | Text generation |
| Flan-T5-XL | 3GB | ⚡⚡ | ⭐⭐⭐⭐ | Lighter LLM |
| LayoutLMv3 | 500MB | ⚡⚡ | ⭐⭐⭐⭐ | Document layout |

---

## Environment Setup

```bash
# 1. Install base packages
pip install -r requirements.txt

# 2. Install advanced features
pip install -r requirements-advanced.txt

# 3. Set environment variables
export HUGGINGFACE_API_TOKEN="hf_xxxxx"  # Get from huggingface.co/settings/tokens
export TRANSFORMERS_CACHE="./models"     # Cache directory

# 4. Download models (first run will auto-download)
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('BAAI/bge-large-en-v1.5')"
```

---

## Testing Models

```python
# test_models.py
from transformers import pipeline

# Test text generation
generator = pipeline("text-generation", model="google/flan-t5-base")
result = generator("Rewrite this: I did Python coding")[0]['generated_text']
print(f"Generated: {result}")

# Test NER
ner = pipeline("ner", model="dslim/bert-base-NER")
entities = ner("I worked at Google using Python and AWS")
print(f"Entities: {entities}")

# Test embeddings
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('BAAI/bge-base-en-v1.5')
embedding = model.encode("This is a test")
print(f"Embedding shape: {embedding.shape}")
```

---

**Ready to upgrade! Start with the RAG engine that's already integrated, then add more models as needed.** 🚀
