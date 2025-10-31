# Quick Start: RAG Implementation in HireScope

## ✅ What's Already Implemented

I've just added a **basic RAG (Retrieval Augmented Generation)** system to HireScope!

### What It Does:
- **Intelligent Suggestions**: Provides context-aware resume improvement tips
- **Score-Based Recommendations**: Analyzes your scores and suggests targeted improvements
- **Keyword Optimization**: Helps improve ATS compatibility
- **Professional Tips**: Retrieves relevant best practices from knowledge base

---

## 🚀 How to Use It

### 1. **It's Already Working!**
The RAG engine is now integrated into the resume upload endpoint. When you analyze a resume, you'll automatically get RAG-powered suggestions in the response.

### 2. **Test It Out**
Upload a resume through the UI and check the response - you'll see a new `rag_suggestions` field with:
- `critical`: Must-fix issues
- `recommended`: Important improvements  
- `tips`: Relevant best practices with relevance scores

### 3. **View Suggestions in Console**
Open browser DevTools → Console to see the full response including RAG suggestions:
```javascript
{
  "scores": {...},
  "keywords": {...},
  "rag_suggestions": {
    "critical": ["Add more job-specific keywords..."],
    "recommended": ["Use quantifiable metrics..."],
    "tips": [
      {
        "tip": "Start with action verbs",
        "category": "writing_style",
        "relevance_score": 0.85
      }
    ]
  }
}
```

---

## 🎯 Next Steps to Add UI for RAG

### Add Suggestions Panel to ResultsDashboard

```jsx
// In ResultsDashboard.jsx

{result.rag_suggestions && (
  <motion.div className="glass-effect rounded-2xl p-6 shadow-card">
    <h2 className="text-xl font-bold text-gray-900 mb-4">
      💡 AI-Powered Suggestions
    </h2>
    
    {/* Critical Issues */}
    {result.rag_suggestions.critical?.length > 0 && (
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-red-600 mb-2">
          🚨 Critical Improvements
        </h3>
        <ul className="space-y-2">
          {result.rag_suggestions.critical.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5">•</span>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {/* Recommended Improvements */}
    {result.rag_suggestions.recommended?.length > 0 && (
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-yellow-600 mb-2">
          ⚡ Recommended Improvements
        </h3>
        <ul className="space-y-2">
          {result.rag_suggestions.recommended.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-500 mt-0.5">•</span>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {/* Best Practice Tips */}
    {result.rag_suggestions.tips?.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-blue-600 mb-2">
          💡 Best Practices
        </h3>
        <div className="space-y-3">
          {result.rag_suggestions.tips.slice(0, 5).map((tip, idx) => (
            <div key={idx} className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-700">{tip.tip}</p>
                <span className="text-xs text-blue-600 font-medium whitespace-nowrap">
                  {(tip.relevance_score * 100).toFixed(0)}% match
                </span>
              </div>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                {tip.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </motion.div>
)}
```

---

## 🔧 Upgrade to More Powerful Models

### Option 1: Use Hugging Face API (Easiest)
```python
# In rag_engine.py, add this method:

from transformers import pipeline

class SimpleRAGEngine:
    def __init__(self):
        # ... existing code ...
        
        # Add text generation pipeline
        self.generator = pipeline(
            "text-generation",
            model="mistralai/Mistral-7B-Instruct-v0.2",
            model_kwargs={"load_in_8bit": True}
        )
    
    def generate_ai_rewrite(self, bullet_point: str, job_context: str):
        """Use LLM to rewrite bullet points"""
        prompt = f"Rewrite this resume bullet to be more ATS-friendly: {bullet_point}"
        return self.generator(prompt, max_length=100)[0]['generated_text']
```

### Option 2: Use OpenAI API (Most Powerful)
```python
import openai

def generate_suggestions_gpt(resume_text: str, job_description: str):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "system",
            "content": "You are an expert resume advisor."
        }, {
            "role": "user",
            "content": f"Analyze this resume and provide 5 specific improvements:\n{resume_text}"
        }]
    )
    return response.choices[0].message.content
```

### Option 3: Use LangChain + Local LLM
```bash
# Install
pip install langchain llama-cpp-python

# Download model (e.g., Mistral 7B quantized)
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf
```

```python
from langchain.llms import LlamaCpp
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

llm = LlamaCpp(
    model_path="./mistral-7b-instruct-v0.2.Q4_K_M.gguf",
    n_ctx=2048,
    n_threads=4
)

template = """You are a resume expert. Provide 3 specific improvements for:
{resume_text}

Job Description: {job_description}

Improvements:"""

prompt = PromptTemplate(template=template, input_variables=["resume_text", "job_description"])
chain = LLMChain(llm=llm, prompt=prompt)

suggestions = chain.run(resume_text=text, job_description=jd)
```

---

## 📊 Add Enhanced OCR

### Install EasyOCR
```bash
pip install easyocr opencv-python
```

### Update parsing.py
```python
import easyocr

def extract_text_with_easyocr(content_bytes: bytes):
    """Enhanced OCR with EasyOCR"""
    reader = easyocr.Reader(['en'])
    
    # Convert PDF to images
    from pdf2image import convert_from_bytes
    images = convert_from_bytes(content_bytes)
    
    all_text = []
    for img in images:
        # Convert PIL to numpy array
        import numpy as np
        img_array = np.array(img)
        
        # Extract text
        results = reader.readtext(img_array)
        page_text = ' '.join([text for (_, text, _) in results])
        all_text.append(page_text)
    
    return '\n'.join(all_text)
```

---

## 🎨 Better Embeddings

### Upgrade to BGE (Best General Embeddings)
```python
# In embedding_store.py

def get_model(name: str = "BAAI/bge-large-en-v1.5"):  # Changed default
    global _MODEL
    if _MODEL is None:
        with _MODEL_LOCK:
            if _MODEL is None:
                _MODEL = SentenceTransformer(name)
    return _MODEL

# Add instruction-based embedding
def embed_with_instruction(texts, instruction="Represent this resume for matching"):
    model = get_model()
    instructed = [f"{instruction}: {text}" for text in texts]
    return model.encode(instructed, normalize_embeddings=True)
```

---

## 🔥 Ready-to-Use Model Options

### For CPU (No GPU needed):
1. **all-MiniLM-L6-v2** - Fastest, already using ✅
2. **BAAI/bge-base-en-v1.5** - Better accuracy, still fast
3. **intfloat/e5-large-v2** - Best CPU performance

### For GPU:
1. **BAAI/bge-large-en-v1.5** - Excellent accuracy
2. **mistralai/Mistral-7B-Instruct** - Full LLM capabilities
3. **meta-llama/Llama-2-7b-chat** - Strong general purpose

### For API (No local setup):
1. **OpenAI GPT-4** - Most powerful
2. **Anthropic Claude** - Great for long context
3. **Cohere** - Specialized for embeddings

---

## 📝 Testing RAG

```python
# Test in Python terminal
from core.rag_engine import get_rag_engine

rag = get_rag_engine()

# Test retrieval
tips = rag.get_relevant_tips("How to write better bullet points?", top_k=3)
for tip in tips:
    print(f"- {tip['tip']} (score: {tip['relevance_score']:.2f})")

# Test full suggestions
suggestions = rag.generate_suggestions(
    resume_text="My resume text...",
    job_description="Looking for Python developer...",
    scores={'keyword': 0.2, 'structural': 0.8, 'tone': 0.7}
)
print(suggestions)
```

---

## 🎯 What's Next?

1. **Test the current RAG** - Upload a resume and check console for suggestions
2. **Add UI panel** - Display suggestions in ResultsDashboard
3. **Choose upgrade path**:
   - Easy: Keep current setup (works great!)
   - Medium: Add Hugging Face API for LLM rewriting
   - Advanced: Self-host Mistral 7B for full control

---

**The RAG system is live and ready to use! Try uploading a resume now.** 🚀
