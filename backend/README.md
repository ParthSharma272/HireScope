---
title: HireScope Backend API
emoji: 📄
colorFrom: purple
colorTo: blue
sdk: docker
sdk_version: "4.26.0"
app_file: app.py
app_port: 7860
pinned: false
---

# 🎯 HireScope Backend API

AI-powered resume analysis using FastAPI, sentence-transformers, and spaCy.

## Features
- 🔍 Semantic resume analysis with AI embeddings
- 📊 ATS compatibility scoring
- 🤖 AI-powered template generation
- 📦 Batch resume processing
- 🎨 Professional DOCX report generation

## Tech Stack
- **Framework**: FastAPI
- **ML Models**: sentence-transformers (all-mpnet-base-v2), spaCy
- **Parser**: PyPDF2, python-docx, pdfplumber
- **Port**: 7860 (Hugging Face default)

## API Documentation
Once running, visit `/docs` for interactive Swagger API documentation.

## Endpoints
- `GET /api/health` - Health check
- `POST /api/analyze` - Resume analysis
- `POST /api/batch/analyze` - Batch processing
- `GET /api/templates` - AI templates
- `POST /api/live/suggestions` - Real-time suggestions

---

**Developed with ❤️ for better hiring**
