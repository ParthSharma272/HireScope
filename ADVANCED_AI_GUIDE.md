# Advanced AI Integration Guide for HireScope

## Overview
This guide explains how to integrate RAG, OCR, and powerful Hugging Face models into HireScope for enhanced resume analysis capabilities.

---

## 1. RAG (Retrieval Augmented Generation)

### What is RAG?
RAG combines retrieval of relevant documents with generative AI to provide context-aware, factually grounded responses.

### Use Cases in HireScope
- **Resume Enhancement Suggestions**: Retrieve similar high-performing resumes and generate improvement suggestions
- **Industry-Specific Insights**: Query knowledge base of job requirements and best practices
- **Personalized Feedback**: Generate contextual advice based on similar successful candidates

### Implementation

```python
# backend/core/rag_engine.py
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import HuggingFaceHub
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import os

class RAGEngine:
    def __init__(self, knowledge_base_path="data/resume_knowledge_base"):
        """
        Initialize RAG engine with vector store and LLM
        """
        # Use a more powerful embedding model
        self.embeddings = HuggingFaceEmbeddings(
            model_name="BAAI/bge-large-en-v1.5",  # Better than all-MiniLM
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        
        # Initialize or load vector store
        self.vector_store = self._load_or_create_vector_store(knowledge_base_path)
        
        # Use a powerful open-source LLM
        self.llm = HuggingFaceHub(
            repo_id="mistralai/Mistral-7B-Instruct-v0.2",
            model_kwargs={
                "temperature": 0.7,
                "max_length": 1024,
                "top_p": 0.95
            },
            huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_TOKEN")
        )
        
        # Create retrieval chain
        self.qa_chain = self._create_qa_chain()
    
    def _load_or_create_vector_store(self, path):
        """Load existing vector store or create new one"""
        if os.path.exists(path):
            return FAISS.load_local(path, self.embeddings)
        else:
            # Create empty vector store
            return FAISS.from_texts(["Initial document"], self.embeddings)
    
    def _create_qa_chain(self):
        """Create retrieval QA chain"""
        prompt_template = """
        You are an expert career advisor and ATS optimization specialist.
        
        Context from knowledge base:
        {context}
        
        Question: {question}
        
        Provide specific, actionable advice based on the context. Focus on:
        - Concrete improvements
        - Industry best practices
        - ATS optimization tips
        
        Answer:
        """
        
        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        return RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={"prompt": PROMPT}
        )
    
    def add_documents(self, documents: list[str]):
        """Add new documents to knowledge base"""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = text_splitter.create_documents(documents)
        self.vector_store.add_documents(chunks)
    
    def get_improvement_suggestions(self, resume_text: str, job_description: str):
        """Get RAG-powered improvement suggestions"""
        query = f"""
        Given this resume and job description, provide 5 specific improvements:
        
        Resume: {resume_text[:500]}...
        Job Description: {job_description[:300]}...
        
        What are the top 5 actionable improvements?
        """
        
        return self.qa_chain.run(query)
    
    def get_similar_resumes(self, resume_text: str, top_k=3):
        """Retrieve similar successful resumes"""
        results = self.vector_store.similarity_search(resume_text, k=top_k)
        return [doc.page_content for doc in results]

# Usage in routes
from core.rag_engine import RAGEngine

rag_engine = RAGEngine()

@router.post("/rag-suggestions")
async def get_rag_suggestions(resume_text: str = Form(...), job_description: str = Form(...)):
    suggestions = rag_engine.get_improvement_suggestions(resume_text, job_description)
    return {"suggestions": suggestions}
```

---

## 2. OCR (Optical Character Recognition)

### Current Implementation
HireScope already has basic OCR fallback using Tesseract for scanned PDFs.

### Enhanced OCR with PaddleOCR or EasyOCR

```python
# backend/core/advanced_ocr.py
import easyocr
from PIL import Image
import io
import cv2
import numpy as np

class AdvancedOCR:
    def __init__(self):
        """Initialize EasyOCR (supports 80+ languages)"""
        self.reader = easyocr.Reader(['en'], gpu=False)  # Set gpu=True if available
    
    def extract_text_with_layout(self, image_bytes: bytes) -> dict:
        """
        Extract text with bounding box information for layout preservation
        """
        # Convert bytes to image
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)
        
        # Perform OCR
        results = self.reader.readtext(image_array, detail=1)
        
        # Structure results
        extracted_data = {
            "text": "",
            "blocks": []
        }
        
        for (bbox, text, confidence) in results:
            extracted_data["text"] += text + " "
            extracted_data["blocks"].append({
                "text": text,
                "confidence": confidence,
                "bbox": bbox,
                "position": {
                    "top": bbox[0][1],
                    "left": bbox[0][0],
                    "width": bbox[2][0] - bbox[0][0],
                    "height": bbox[2][1] - bbox[0][1]
                }
            })
        
        return extracted_data
    
    def preprocess_image(self, image_array: np.ndarray) -> np.ndarray:
        """
        Preprocess image for better OCR accuracy
        """
        # Convert to grayscale
        gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(gray)
        
        # Adaptive thresholding
        threshold = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        return threshold
```

---

## 3. Powerful Hugging Face Models

### 3.1 Document Understanding with LayoutLM

```python
# backend/core/layout_analysis.py
from transformers import LayoutLMv3Processor, LayoutLMv3ForTokenClassification
import torch
from PIL import Image

class LayoutAnalyzer:
    def __init__(self):
        """Initialize LayoutLMv3 for document understanding"""
        self.processor = LayoutLMv3Processor.from_pretrained(
            "microsoft/layoutlmv3-base"
        )
        self.model = LayoutLMv3ForTokenClassification.from_pretrained(
            "microsoft/layoutlmv3-base"
        )
    
    def extract_structured_data(self, image_path: str, ocr_data: dict):
        """
        Extract structured information (Name, Email, Phone, Skills, etc.)
        using visual and textual cues
        """
        image = Image.open(image_path)
        
        # Prepare inputs
        encoding = self.processor(
            image,
            ocr_data["text"],
            boxes=[[block["bbox"] for block in ocr_data["blocks"]]],
            return_tensors="pt"
        )
        
        # Get predictions
        with torch.no_grad():
            outputs = self.model(**encoding)
            predictions = outputs.logits.argmax(-1).squeeze().tolist()
        
        # Map predictions to labels
        labels = ["NAME", "EMAIL", "PHONE", "SKILLS", "EXPERIENCE", "EDUCATION", "OTHER"]
        structured_data = self._group_by_labels(ocr_data, predictions, labels)
        
        return structured_data
```

### 3.2 Better Embeddings with BAAI/bge or Instructor Models

```python
# backend/core/advanced_embeddings.py
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModel
import torch

class AdvancedEmbeddings:
    def __init__(self, model_name="BAAI/bge-large-en-v1.5"):
        """
        Initialize with state-of-the-art embedding model
        
        Options:
        - BAAI/bge-large-en-v1.5 (Best for general retrieval)
        - intfloat/e5-large-v2 (Excellent for semantic search)
        - hkunlp/instructor-xl (Instruction-based embeddings)
        """
        self.model = SentenceTransformer(model_name)
    
    def embed_with_instruction(self, texts: list[str], instruction: str):
        """
        Create embeddings with specific instructions
        Useful for: "Represent the resume for matching with job descriptions"
        """
        instructed_texts = [f"{instruction}: {text}" for text in texts]
        embeddings = self.model.encode(instructed_texts, normalize_embeddings=True)
        return embeddings

# Update embedding_store.py to use this
```

### 3.3 Resume Rewriting with LLMs

```python
# backend/core/llm_rewriter.py
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch

class ResumeRewriter:
    def __init__(self):
        """
        Initialize LLM for resume rewriting
        
        Options:
        - mistralai/Mistral-7B-Instruct-v0.2
        - meta-llama/Llama-2-7b-chat-hf
        - google/flan-t5-xl (lighter option)
        """
        self.tokenizer = AutoTokenizer.from_pretrained(
            "mistralai/Mistral-7B-Instruct-v0.2"
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            "mistralai/Mistral-7B-Instruct-v0.2",
            torch_dtype=torch.float16,
            device_map="auto"
        )
        
        self.pipe = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer
        )
    
    def rewrite_bullet_point(self, bullet: str, job_context: str):
        """
        Rewrite a resume bullet point to be more ATS-friendly
        """
        prompt = f"""[INST] You are a professional resume writer. 
        
Rewrite this bullet point to be more impactful and ATS-optimized:
"{bullet}"

Context: This is for a job in {job_context}

Requirements:
- Start with a strong action verb
- Include quantifiable metrics if possible
- Use industry keywords
- Keep it concise (1-2 lines)

Rewritten bullet point: [/INST]"""
        
        result = self.pipe(
            prompt,
            max_length=200,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )
        
        return result[0]["generated_text"].split("[/INST]")[-1].strip()
```

### 3.4 Skill Extraction with NER Models

```python
# backend/core/skill_extractor.py
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

class SkillExtractor:
    def __init__(self):
        """
        Use specialized NER model for skill extraction
        """
        self.nlp = pipeline(
            "ner",
            model="jjzha/jobbert_skill_extraction",
            aggregation_strategy="simple"
        )
    
    def extract_skills(self, text: str) -> list[dict]:
        """
        Extract technical and soft skills from resume text
        """
        entities = self.nlp(text)
        
        skills = []
        for entity in entities:
            if entity['entity_group'] == 'SKILL':
                skills.append({
                    'skill': entity['word'],
                    'confidence': entity['score'],
                    'start': entity['start'],
                    'end': entity['end']
                })
        
        return skills
```

---

## 4. Installation Requirements

```bash
# Add to requirements.txt

# RAG Dependencies
langchain==0.1.0
langchain-community==0.0.13
faiss-cpu==1.7.4  # or faiss-gpu for GPU support
tiktoken==0.5.2

# Enhanced OCR
easyocr==1.7.0
opencv-python==4.9.0.80
paddlepaddle==2.6.0  # Optional: for PaddleOCR
paddleocr==2.7.0     # Optional: alternative to EasyOCR

# Advanced Models
transformers==4.36.0
torch==2.1.2
accelerate==0.25.0   # For faster loading
bitsandbytes==0.41.3 # For 8-bit quantization

# Better Embeddings
sentence-transformers==2.3.1
```

---

## 5. Environment Variables

```bash
# Add to .env file

# Hugging Face Token (for gated models and higher rate limits)
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxx

# OpenAI (if using GPT models)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# Model Cache Directory
TRANSFORMERS_CACHE=/path/to/models/cache
```

---

## 6. API Endpoints

```python
# backend/routes/advanced_routes.py
from fastapi import APIRouter, UploadFile, File, Form
from core.rag_engine import RAGEngine
from core.advanced_ocr import AdvancedOCR
from core.llm_rewriter import ResumeRewriter
from core.skill_extractor import SkillExtractor

router = APIRouter()

# Initialize models (singleton pattern recommended)
rag_engine = RAGEngine()
ocr_engine = AdvancedOCR()
rewriter = ResumeRewriter()
skill_extractor = SkillExtractor()

@router.post("/advanced-ocr")
async def advanced_ocr(file: UploadFile = File(...)):
    """Extract text from scanned documents with high accuracy"""
    content = await file.read()
    result = ocr_engine.extract_text_with_layout(content)
    return result

@router.post("/rag-suggestions")
async def rag_suggestions(
    resume_text: str = Form(...),
    job_description: str = Form(...)
):
    """Get AI-powered improvement suggestions using RAG"""
    suggestions = rag_engine.get_improvement_suggestions(
        resume_text, 
        job_description
    )
    return {"suggestions": suggestions}

@router.post("/rewrite-bullet")
async def rewrite_bullet(
    bullet_point: str = Form(...),
    job_context: str = Form(...)
):
    """Rewrite a bullet point using LLM"""
    rewritten = rewriter.rewrite_bullet_point(bullet_point, job_context)
    return {"original": bullet_point, "rewritten": rewritten}

@router.post("/extract-skills")
async def extract_skills(text: str = Form(...)):
    """Extract skills using specialized NER model"""
    skills = skill_extractor.extract_skills(text)
    return {"skills": skills}
```

---

## 7. Performance Optimization Tips

### 7.1 Model Quantization
```python
# Load models in 8-bit for faster inference
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(
    load_in_8bit=True,
    llm_int8_threshold=6.0
)

model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-Instruct-v0.2",
    quantization_config=quantization_config,
    device_map="auto"
)
```

### 7.2 Batch Processing
```python
# Process multiple resumes in batches
def batch_embed(texts: list[str], batch_size=32):
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        batch_embeddings = model.encode(batch)
        embeddings.extend(batch_embeddings)
    return embeddings
```

### 7.3 Caching
```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_embedding(text: str):
    """Cache embeddings for frequently processed texts"""
    return model.encode([text])[0]
```

---

## 8. Frontend Integration

```javascript
// Add to frontend for new features

// RAG Suggestions
async function getRAGSuggestions(resumeText, jobDescription) {
  const formData = new FormData();
  formData.append('resume_text', resumeText);
  formData.append('job_description', jobDescription);
  
  const response = await axios.post(
    'http://localhost:8000/api/advanced/rag-suggestions',
    formData
  );
  
  return response.data.suggestions;
}

// Bullet Point Rewriter
async function rewriteBullet(bullet, context) {
  const formData = new FormData();
  formData.append('bullet_point', bullet);
  formData.append('job_context', context);
  
  const response = await axios.post(
    'http://localhost:8000/api/advanced/rewrite-bullet',
    formData
  );
  
  return response.data.rewritten;
}
```

---

## 9. Next Steps

1. **Start Small**: Begin with RAG for improvement suggestions
2. **GPU Acceleration**: If available, enable GPU for faster inference
3. **Fine-tuning**: Consider fine-tuning models on resume datasets
4. **Monitoring**: Add logging and monitoring for model performance
5. **A/B Testing**: Test different models and compare results

---

## 10. Resources

- [Hugging Face Models](https://huggingface.co/models)
- [LangChain Documentation](https://python.langchain.com/)
- [RAG Tutorial](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [LayoutLM Paper](https://arxiv.org/abs/1912.13318)
- [BGE Embeddings](https://huggingface.co/BAAI/bge-large-en-v1.5)

---

**Ready to implement? Start with RAG for immediate impact!** 🚀
