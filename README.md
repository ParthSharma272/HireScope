# 🎯 HireScope - AI-Powered Resume Analysis Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-19.1.1-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

> **Transform your hiring process with cutting-edge AI/ML technology**

<img width="1680" height="929" alt="Screenshot 2025-11-01 at 5 12 19 PM" src="https://github.com/user-attachments/assets/ce887cf6-2f68-485a-adab-722ccd6375ab" />

HireScope is an advanced resume analysis platform that leverages state-of-the-art NLP, semantic embeddings, and machine learning to revolutionize how you evaluate candidates. Built with modern web technologies and AI models, it provides instant, actionable insights to help both job seekers optimize their resumes and recruiters find the perfect match.

[🚀 Live Demo](hire-scope-gules.vercel.app/) • [📖 Documentation](#-table-of-contents) • [🐛 Report Bug](https://github.com/ParthSharma272/HireScope/issues) • [✨ Request Feature](https://github.com/ParthSharma272/HireScope/issues)

---

## 📑 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🤖 AI-Powered Analysis
- **Multi-Dimensional Scoring**: Evaluates resumes across 5 key dimensions
  - Structural Quality (sections, formatting)
  - Keyword Match (job description alignment)
  - Semantic Relevance (contextual understanding)
  - Readability (clarity and conciseness)
  - Tone & Impact (action verbs, achievements)
- **Role Detection**: Automatically identifies candidate profile (Tech, Manager, Creative, General)
- **Semantic Embeddings**: Uses sentence-transformers for deep contextual understanding (384-dimensional vectors)
- **Weighted Keyword Matching**: Prioritizes required (2x), preferred (1x), and bonus (0.5x) keywords

### 📊 Advanced Analytics
- **ATS Compatibility Scoring**: 0-100 score with specific formatting issues
- **Gap Analysis**: Identifies missing skills with priority levels (Critical → High → Medium)
- **Competitive Intelligence**: Percentile ranking and skill strength assessment
- **Quick Wins Identification**: 3-5 high-impact, easy-to-implement improvements
- **Before/After Examples**: Concrete improvement suggestions
- **Time-to-Implement Estimates**: Helps prioritize resume updates

### 💡 Intelligent Insights
- **7 Specialized Analysis Modules**:
  1. ATS Optimization
  2. Gap Analysis
  3. Competitive Benchmarking
  4. Section-Specific Recommendations
  5. Keyword Optimization
  6. Format & Structure
  7. Content Enhancement
- **60+ Expert Tips**: Enhanced RAG knowledge base (6x industry best practices)
- **Multi-Level Prioritization**: Critical → High → Medium → Optional
- **Overall Grade**: A/B/C/D rating with detailed breakdown

### 🔧 Technical Excellence
- **Fast Processing**: 2-3 second average analysis time
- **File Format Support**: PDF and DOCX
- **OCR Capability**: Handles scanned documents (optional Tesseract integration)
- **Caching Layer**: Redis + memory fallback for performance
- **Lazy Loading**: 92% faster startup with on-demand model loading
- **Error Handling**: Comprehensive error messages and recovery
- **CORS Support**: Cross-origin resource sharing enabled

---

## 🎬 Demo

### Visual Workflow

```
┌─────────────────┐      ┌──────────────────┐      ┌────────────────────┐
│  Upload Resume  │ ───> │  AI Processing   │ ───> │  Results Dashboard │
│  + Job Desc     │      │  (2-3 seconds)   │      │  + Insights        │
└─────────────────┘      └──────────────────┘      └────────────────────┘
```

### Sample Output

**Overall Score**: 87/100 (Strong Match) 🟢

**Breakdown**:
- Structural Quality: 92% ⭐⭐⭐⭐⭐
- Keyword Match: 85% ⭐⭐⭐⭐
- Semantic Relevance: 88% ⭐⭐⭐⭐⭐
- Readability: 90% ⭐⭐⭐⭐⭐
- Tone & Impact: 80% ⭐⭐⭐⭐

**Matched Keywords**: Python, React, AWS, Docker, API Design (15 more...)

**Missing Keywords**: Kubernetes, GraphQL, TypeScript

**Quick Wins**:
1. Add missing "Kubernetes" keyword → +8 points
2. Quantify achievements with metrics → +5 points
3. Add technical skills section → +4 points

---

## 🛠️ Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) 0.115.4 - High-performance Python web framework
- **Server**: [Uvicorn](https://www.uvicorn.org/) - Lightning-fast ASGI server
- **AI/ML Stack**:
  - [Sentence Transformers](https://www.sbert.net/) 2.2.2 - Semantic embeddings
  - [spaCy](https://spacy.io/) 3.8.7 - NLP preprocessing
  - [Transformers](https://huggingface.co/transformers/) 4.57.1 - Model inference
  - [scikit-learn](https://scikit-learn.org/) - Scoring algorithms
- **Document Processing**:
  - [PyPDF2](https://pypdf2.readthedocs.io/) - PDF extraction
  - [python-docx](https://python-docx.readthedocs.io/) - DOCX parsing
  - [pytesseract](https://github.com/madmaze/pytesseract) - OCR (optional)
- **Caching**: [Redis](https://redis.io/) + in-memory fallback
- **Validation**: [Pydantic](https://pydantic-docs.helpmanual.io/) 2.0+

### Frontend
- **Framework**: [React](https://reactjs.org/) 19.1.1 - Latest with concurrent features
- **Build Tool**: [Vite](https://vitejs.dev/) 7.1.7 - Next-generation frontend tooling
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.4.18 - Utility-first CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/) 12.23.24 - Production-ready animations
- **Charts**: [Recharts](https://recharts.org/) 3.3.0 - React charting library
- **Icons**: [Heroicons](https://heroicons.com/) 2.2.0 - Beautiful SVG icons
- **HTTP Client**: [Axios](https://axios-http.com/) 1.13.1 - Promise-based requests
- **UI Components**: [Headless UI](https://headlessui.com/) 2.2.9 - Unstyled components

### AI Models
- **Embeddings**: `all-MiniLM-L6-v2` (384-dimensional)
- **NLP**: spaCy `en_core_web_sm` English model
- **Tokenization**: Sentence-level semantic chunking

---

## 🏗️ Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Hero      │  │  UploadZone  │  │ ResultsDashboard │   │
│  │  Component  │  │  (Drag&Drop) │  │   (Analytics)    │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌──────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  API Routes Layer                    │    │
│  │  POST /api/resume/upload                             │    │
│  │  POST /api/resume/analyze                            │    │
│  │  GET  /api/health                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Core Processing Pipeline                │    │
│  │  1. Parsing      → Extract text (PDF/DOCX/OCR)      │    │
│  │  2. Preprocessing → spaCy tokenization/segmentation  │    │
│  │  3. Embeddings   → SentenceTransformer vectors       │    │
│  │  4. Keywords     → NLP extraction + matching         │    │
│  │  5. Scoring      → Multi-dimensional algorithm       │    │
│  │  6. Insights     → RAG-enhanced recommendations      │    │
│  │  7. Response     → Structured JSON + metadata        │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  AI/ML Layer                         │    │
│  │  ┌──────────────┐  ┌────────────┐  ┌────────────┐  │    │
│  │  │ Embeddings   │  │   spaCy    │  │ scikit-    │  │    │
│  │  │ Model Cache  │  │  NLP Model │  │  learn     │  │    │
│  │  └──────────────┘  └────────────┘  └────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                              │
                              │
                    ┌─────────────────┐
                    │  Redis Cache    │
                    │  (Optional)     │
                    └─────────────────┘
```

### Data Flow

1. **Upload Phase**
   ```
   User → File Selection → Validation → FormData → API Request
   ```

2. **Processing Phase**
   ```
   API → Parse Document → Extract Text → Clean & Tokenize
       → Generate Embeddings → Match Keywords → Calculate Scores
       → Generate Insights → Build Response
   ```

3. **Presentation Phase**
   ```
   API Response → Frontend State → Animate Components
               → Render Charts → Display Insights
   ```

---

## 📦 Installation

### Prerequisites

- **Python**: 3.13+ ([Download](https://www.python.org/downloads/))
- **Node.js**: 18+ ([Download](https://nodejs.org/))
- **npm**: 10+ (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))

### Optional (for OCR support)
- **Tesseract**: OCR engine ([Installation Guide](https://tesseract-ocr.github.io/tessdoc/Installation.html))
- **Poppler**: PDF rendering library ([Installation Guide](https://poppler.freedesktop.org/))

### Clone Repository

```bash
# Clone the repository
git clone https://github.com/ParthSharma272/HireScope.git

# Navigate to project directory
cd HireScope
```

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm

# Verify installation
python -c "import fastapi; import sentence_transformers; import spacy; print('✅ All dependencies installed!')"
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd ../hirescope-frontend

# Install dependencies
npm install

# Verify installation
npm list react vite tailwindcss
```

---

## 🚀 Quick Start

### Step 1: Start Backend Server

```bash
cd backend
source venv/bin/activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

**Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 2: Start Frontend Server

```bash
# In a new terminal window
cd hirescope-frontend
npm run dev
```

**Output:**
```
VITE v7.1.7  ready in 328 ms

➜  Local:   http://localhost:5175/
➜  Network: use --host to expose
```

### Step 3: Access Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5175
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs (Interactive Swagger UI)
- **Health Check**: http://127.0.0.1:8000/api/health

### Step 4: Analyze Your First Resume

1. **Upload Resume**: Drag and drop a PDF or DOCX file
2. **Paste Job Description**: Copy-paste the job posting text
3. **Click "Analyze Resume"**: Wait 2-3 seconds for AI processing
4. **View Results**: Explore scores, keywords, and insights
5. **Implement Suggestions**: Apply AI-powered recommendations

---

## 📞 Contact

**Parth Sharma**

- 📧 Email: [parthsharma23212@gmail.com](mailto:parthsharma23212@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/parth-sharma-08b1b424b](https://www.linkedin.com/in/parth-sharma-08b1b424b/)
- 🐙 GitHub: [@ParthSharma272](https://github.com/ParthSharma272)
- 📝 Medium: [@parthsharma23212](https://medium.com/@parthsharma23212)
- 🌐 Portfolio: [portfolio-website-f311.vercel.app](https://portfolio-website-f311.vercel.app/)

---

## 🙏 Acknowledgments

### Design Inspiration
- **EnhanceCV** - Clean card-based design and modern aesthetics
- **Resume.io** - Professional color palette and typography
- **FlowCV** - Smooth animations and user experience
- **MyPerfectResume** - Clear data visualization patterns
- **Resume Worded** - Actionable insights presentation

### Open Source Libraries
- **[Hugging Face](https://huggingface.co/)** - Sentence Transformers models
- **[spaCy](https://spacy.io/)** - Industrial-strength NLP
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[React](https://reactjs.org/)** - UI library by Meta
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Heroicons](https://heroicons.com/)** - Beautiful SVG icons by Tailwind Labs

### Research Papers
- **Sentence-BERT**: Reimers & Gurevych (2019) - "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks"
- **BERT**: Devlin et al. (2018) - "BERT: Pre-training of Deep Bidirectional Transformers"
- **Attention Mechanism**: Vaswani et al. (2017) - "Attention Is All You Need"

### Community
- Stack Overflow community
- Reddit r/MachineLearning
- GitHub open source contributors
- FastAPI Discord server
- React community

---

## ⭐ Show Your Support

If you find HireScope helpful, please consider:

- ⭐ **Star this repository** 
- 🐛 **Report bugs** and suggest features via [Issues](https://github.com/ParthSharma272/HireScope/issues)
- 🤝 **Contribute** code or documentation
- 💬 **Share** with your network

---

<div align="center">

**Made with ❤️ by [Parth Sharma](https://github.com/ParthSharma272)**

**© 2025 HireScope. All Rights Reserved.**

[⬆ Back to Top](#-hirescope---ai-powered-resume-analysis-platform)

</div>
