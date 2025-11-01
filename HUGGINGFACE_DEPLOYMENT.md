# 🤗 Deploy HireScope on Hugging Face Spaces (FREE FOREVER!)

Hugging Face Spaces is **100% free** with no time limits, perfect for ML/AI applications!

---

## 🎁 Why Hugging Face Spaces?

✅ **Completely FREE forever** (no trial expiration!)  
✅ **16 GB RAM** on free tier (32x more than Render!)  
✅ **Perfect for ML models** (designed for AI apps)  
✅ **No credit card required**  
✅ **Community-focused** (great for portfolio)  
✅ **Easy deployment** (Git-based)  
✅ **Public or private** spaces  

---

## 🚀 Quick Deploy to Hugging Face

### Step 1: Create Hugging Face Account

1. Go to [huggingface.co](https://huggingface.co/)
2. Sign up (free account)
3. Verify email

### Step 2: Create a New Space

1. Click your profile → **"New Space"**
2. **Space name**: `hirescope-backend`
3. **License**: MIT or Apache 2.0
4. **SDK**: Select **"Docker"**
5. **Visibility**: Public (or Private if you have PRO)
6. Click **"Create Space"**

### Step 3: Connect Your Repository

**Option A: Direct Git Push**

```bash
# Add Hugging Face remote
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/hirescope-backend

# Push backend code
git subtree push --prefix backend hf main
```

**Option B: Manual File Upload**

1. Go to your Space → **"Files"** tab
2. Upload files from `backend/` directory
3. Make sure to upload all Python files and requirements.txt

### Step 4: Create Dockerfile

Hugging Face Spaces uses Docker. Create this file in your Space:

**`Dockerfile`** (in the Space root):

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy application code
COPY . .

# Expose port
EXPOSE 7860

# Start command (Hugging Face uses port 7860)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
```

### Step 5: Create README.md

Hugging Face requires a README with metadata:

**`README.md`** (in the Space root):

```markdown
---
title: HireScope Backend
emoji: 📄
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
---

# HireScope Backend

AI-powered resume analysis API built with FastAPI and sentence-transformers.

## Features
- Semantic resume analysis
- ATS compatibility checking
- AI template generation
- Batch resume processing

## API Documentation
Once running, visit `/docs` for interactive API documentation.
```

### Step 6: Deploy!

Push your changes and Hugging Face will automatically build and deploy:

```bash
git add Dockerfile README.md
git commit -m "Add Hugging Face deployment config"
git push hf main
```

**Your Space URL**: `https://YOUR_USERNAME-hirescope-backend.hf.space`

---

## 🔧 Alternative: Hugging Face Inference API

You can also use Hugging Face's free Inference API instead of hosting:

1. **Get API Token**: Profile → Settings → Access Tokens
2. **Use Hosted Models**: No need to host embeddings yourself
3. **Update backend** to use HF Inference API

This reduces memory usage significantly!

---

## 📦 Other FREE Forever Options

### 1. **Google Cloud Run** (Best Alternative)

✅ **2 million requests/month FREE**  
✅ **Up to 8 GB RAM**  
✅ **Scales to zero** (no cold starts after first use)  
⚠️ Requires credit card (but won't charge in free tier)  

**Setup**:
```bash
# Install gcloud CLI
brew install google-cloud-sdk

# Login
gcloud auth login

# Deploy
gcloud run deploy hirescope-backend \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 2. **Oracle Cloud Free Tier**

✅ **Always FREE** (not a trial!)  
✅ **24 GB RAM** across instances  
✅ **200 GB bandwidth/month**  
⚠️ More complex setup  

**What you get**:
- 2 AMD-based VMs (1 GB RAM each)
- OR 4 ARM-based VMs (24 GB RAM total!)
- Always free, no expiration

### 3. **Deta Space**

✅ **Completely FREE**  
✅ **No credit card**  
✅ **Easy deployment**  
⚠️ Limited to smaller apps  

### 4. **Koyeb**

✅ **Free tier forever**  
✅ **512 MB RAM** (same as Render)  
✅ **No sleep mode**  
⚠️ Still might have memory issues  

---

## 🏆 Best Options Ranked (FREE Forever)

### For HireScope with 8+ GB RAM Needed:

1. **🥇 Hugging Face Spaces** ⭐ BEST CHOICE
   - FREE forever
   - 16 GB RAM
   - Perfect for ML
   - No credit card needed

2. **🥈 Google Cloud Run**
   - FREE tier (2M requests/month)
   - 8 GB RAM
   - Requires credit card (no charges in free tier)
   - Professional solution

3. **🥉 Oracle Cloud Free Tier**
   - Always FREE (24 GB RAM with ARM instances)
   - More complex setup
   - Great once configured

### For Optimized Smaller Model (<512 MB):

4. **Koyeb** (512 MB, no sleep)
5. **Render** (512 MB, sleeps after 15 min)
6. **Fly.io** (256 MB)

---

## 💡 My Recommendation

### Best Solution: Hugging Face Spaces 🤗

**Why?**
- ✅ **100% FREE FOREVER**
- ✅ **16 GB RAM** (perfect for your ML models)
- ✅ **No credit card needed**
- ✅ **Easy deployment** (just push to Git)
- ✅ **Great for portfolio** (hosted on AI platform)
- ✅ **Built for ML apps** (perfect fit!)

**Setup Time**: 15 minutes  
**Cost**: $0 forever  
**Reliability**: Excellent  

### Second Best: Google Cloud Run

**Why?**
- ✅ Always free tier (2M requests/month)
- ✅ Professional infrastructure
- ✅ 8 GB RAM
- ⚠️ Requires credit card (but no charges)

---

## 🎯 Quick Start Guide

### Deploy to Hugging Face (Recommended)

```bash
cd /Users/parth/Desktop/HireScope

# 1. Create Dockerfile for HF
cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm
COPY . .
EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
EOF

# 2. Create HF README
cat > backend/README.md << 'EOF'
---
title: HireScope Backend
emoji: 📄
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
---
# HireScope Backend API
EOF

# 3. Commit
git add backend/Dockerfile backend/README.md
git commit -m "Add Hugging Face Spaces deployment config"

# 4. Sign up at huggingface.co
# 5. Create new Space (Docker SDK)
# 6. Push to HF (instructions in your Space)
```

---

## 🆚 Cost Comparison (Forever)

| Service | RAM | Cost | Credit Card? | Best For |
|---------|-----|------|--------------|----------|
| **HF Spaces** | 16 GB | **$0** ✅ | No ✅ | **ML/AI apps** |
| Google Cloud Run | 8 GB | $0* | Yes | Professional apps |
| Oracle Free Tier | 24 GB | $0* | Yes | Advanced users |
| Railway | 8 GB | **$5/mo** ❌ | Yes after trial | Easy setup |
| Render | 512 MB | $0 | No | Small APIs |
| Vercel Functions | 1 GB | $0 | No | Serverless |

*Free tier, won't charge unless you upgrade

---

## 📖 Documentation Links

- **Hugging Face Spaces**: https://huggingface.co/docs/hub/spaces
- **Google Cloud Run**: https://cloud.google.com/run/docs
- **Oracle Cloud Free**: https://www.oracle.com/cloud/free/

---

## 🎉 Summary

**For HireScope Backend:**

**🏆 Best Choice: Hugging Face Spaces**
```
✅ FREE FOREVER (no trial expiration!)
✅ 16 GB RAM (perfect for ML models)
✅ No credit card required
✅ Easy Git-based deployment
✅ Great for AI/ML portfolio
✅ Community focused
```

**Setup Steps:**
1. Sign up at huggingface.co (free)
2. Create new Space (Docker SDK)
3. Add Dockerfile + README
4. Push your code
5. Done! 🎉

**Your URL**: `https://YOUR_USERNAME-hirescope-backend.hf.space`

---

**🤗 Go with Hugging Face Spaces - it's made for apps like yours!**

**Last Updated**: November 1, 2025
