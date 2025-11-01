# 🚀 HireScope Deployment Guide

Complete guide to deploy HireScope for free as a live web application.

---

## 📋 Deployment Strategy

- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Total Cost**: $0/month

---

## 🔧 Prerequisites

1. GitHub account
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. Render account (sign up at [render.com](https://render.com))
4. Git installed locally

---

## 📦 Part 1: Prepare Your Code

### Step 1: Update .gitignore

Ensure your `.gitignore` includes:

```bash
# Dependencies
node_modules/
venv/
__pycache__/

# Environment files
.env
.env.local
.env.production.local

# Build outputs
dist/
build/

# OS files
.DS_Store

# IDE
.vscode/
.idea/
```

### Step 2: Commit All Changes

```bash
cd /Users/parth/Desktop/HireScope

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment: Add Vercel and Render configs"

# Push to GitHub
git push origin master:main
```

---

## 🌐 Part 2: Deploy Backend (Render)

### Option A: Deploy via Render Dashboard

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect Your GitHub Repository**
   - Authorize Render to access your GitHub
   - Select the `HireScope` repository

4. **Configure Service**:
   ```
   Name: hirescope-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt && python -m spacy download en_core_web_sm
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   Plan: Free
   ```

5. **Environment Variables**:
   ```
   PORT: 10000 (auto-set by Render)
   PYTHON_VERSION: 3.11.0
   ```

6. **Click "Create Web Service"**

7. **Wait for Deployment** (5-10 minutes first time)

8. **Copy Your Backend URL**:
   - Will be something like: `https://hirescope-backend.onrender.com`
   - **IMPORTANT**: Save this URL for frontend configuration!

### Option B: Deploy via Render Blueprint (render.yaml)

1. **Create `render.yaml` in root** (already created)

2. **Go to Render Dashboard** → "Blueprints" → "New Blueprint"

3. **Connect Repository** and select `HireScope`

4. **Render will auto-detect** the `render.yaml` file

5. **Click "Apply"** and wait for deployment

---

## 💻 Part 3: Deploy Frontend (Vercel)

### Step 1: Update API URL in Frontend

**Update `.env.production` with your Render backend URL:**

```bash
cd /Users/parth/Desktop/HireScope/hirescope-frontend

# Edit .env.production
nano .env.production
```

Replace with your actual Render URL:
```env
VITE_API_URL=https://hirescope-backend.onrender.com
```

**Commit the change:**
```bash
git add .env.production
git commit -m "Update production API URL"
git push origin master:main
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd /Users/parth/Desktop/HireScope/hirescope-frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: hirescope-frontend
# - Directory: ./
# - Override settings? N
```

#### Option B: Via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New..." → "Project"**

3. **Import Git Repository**:
   - Click "Import" next to your `HireScope` repository

4. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: hirescope-frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Environment Variables**:
   ```
   VITE_API_URL: https://hirescope-backend.onrender.com
   ```
   (Replace with your actual Render URL)

6. **Click "Deploy"**

7. **Wait for Deployment** (2-3 minutes)

8. **Your Live URL**:
   - Will be something like: `https://hirescope-frontend.vercel.app`
   - **Vercel provides HTTPS automatically!**

---

## 🔐 Part 4: Configure CORS on Backend

### Update Backend CORS Settings

The backend needs to allow requests from your Vercel frontend URL.

**Edit `/Users/parth/Desktop/HireScope/backend/app.py`:**

Find the CORS configuration and update:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add your Vercel URL here
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://hirescope-frontend.vercel.app",  # Your Vercel URL
    "https://*.vercel.app",  # Allow all Vercel preview deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Commit and Push:**
```bash
cd /Users/parth/Desktop/HireScope
git add backend/app.py
git commit -m "Update CORS for production deployment"
git push origin master:main
```

**Render will auto-deploy** the updated backend (takes 2-3 minutes).

---

## ✅ Part 5: Verify Deployment

### Test Backend API

```bash
# Test health endpoint
curl https://hirescope-backend.onrender.com/api/health

# Expected response:
# {"status":"healthy","timestamp":"...","version":"2.0.0"}
```

### Test Frontend

1. **Open your Vercel URL** in browser
2. **Upload a test resume**
3. **Paste a job description**
4. **Click "Analyze Resume"**
5. **Verify results display correctly**

### Check Browser Console

- Open DevTools (F12)
- Check Console for any errors
- Verify API calls go to correct backend URL

---

## 🐛 Troubleshooting

### Issue 1: Backend Build Fails

**Problem**: spaCy model download fails

**Solution**: Update `requirements.txt` to pin spaCy version:
```txt
spacy==3.7.0
```

Then force rebuild on Render:
- Dashboard → Your Service → "Manual Deploy" → "Clear build cache & deploy"

### Issue 2: Frontend API Calls Fail

**Problem**: CORS errors in browser console

**Solution**: 
1. Check `VITE_API_URL` in `.env.production` is correct
2. Verify CORS origins in backend `app.py` include your Vercel URL
3. Redeploy both services

### Issue 3: 500 Internal Server Error

**Problem**: Backend crashes on certain requests

**Solution**: Check Render logs:
- Dashboard → Your Service → "Logs"
- Look for Python errors
- Common issue: Missing dependencies in `requirements.txt`

### Issue 4: Frontend Build Fails

**Problem**: Vite build errors

**Solution**:
```bash
# Test build locally first
cd hirescope-frontend
npm run build

# Fix any errors, then push
git add .
git commit -m "Fix build errors"
git push origin master:main
```

### Issue 5: Render Free Tier Sleeps

**Problem**: Backend takes 30+ seconds to respond (cold start)

**Solution**: 
- **Expected behavior** on Render free tier
- Backend "sleeps" after 15 minutes of inactivity
- First request wakes it up (slow)
- Subsequent requests are fast
- **Workaround**: Use cron-job.org to ping backend every 10 minutes

---

## 🚀 Performance Optimization

### Backend Optimization

1. **Enable Caching** (already implemented with Redis fallback)

2. **Lazy Load Models** (already implemented):
   ```python
   # Models load on-demand, not at startup
   # Faster initial deployment
   ```

3. **Keep Render Awake**:
   - Sign up at [cron-job.org](https://cron-job.org)
   - Create job to ping `https://hirescope-backend.onrender.com/api/health` every 10 minutes
   - Prevents cold starts

### Frontend Optimization

1. **Already Optimized**:
   - Code splitting
   - Lazy loading
   - Optimized assets
   - Vercel CDN

2. **Custom Domain** (Optional):
   - Vercel: Settings → Domains → Add
   - Add your domain (e.g., `hirescope.yourdomain.com`)

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Both Vercel and Render auto-deploy when you push to `main` branch!**

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin master:main

# Vercel auto-deploys frontend (2-3 min)
# Render auto-deploys backend (5-10 min)
```

### Preview Deployments

**Vercel**: Creates preview URL for every branch/PR
- Test changes before merging to main
- Each PR gets unique URL: `https://hirescope-frontend-git-feature-branch.vercel.app`

**Render**: Manual only on free tier
- Deploy specific branches from dashboard

---

## 💰 Cost Analysis

### Current Setup (Free Forever)

| Service | Free Tier Limits | Cost |
|---------|------------------|------|
| **Vercel** | 100 GB bandwidth/month | $0 |
| | Unlimited sites | |
| | Automatic HTTPS | |
| **Render** | 750 hours/month | $0 |
| | 512 MB RAM | |
| | Sleeps after 15 min | |
| **GitHub** | Unlimited repos | $0 |
| **Total** | | **$0/month** |

### Upgrade Options (If Needed)

**If traffic grows:**

| Service | Paid Tier | Features | Cost |
|---------|-----------|----------|------|
| **Vercel Pro** | 1 TB bandwidth | No limits, Analytics | $20/month |
| **Render Starter** | Always-on, 1 GB RAM | No sleep, faster | $7/month |

**When to upgrade:**
- Vercel: > 100 GB bandwidth/month (very high traffic)
- Render: Need instant responses (no cold starts)

---

## 📊 Monitoring & Analytics

### Built-in Monitoring

**Vercel Analytics** (Free):
- Dashboard → Your Project → Analytics
- Real-time visitors
- Performance metrics
- Core Web Vitals

**Render Logs** (Free):
- Dashboard → Your Service → Logs
- Real-time backend logs
- Error tracking
- Request monitoring

### Add Google Analytics (Optional)

1. **Get GA4 Tracking ID** from [analytics.google.com](https://analytics.google.com)

2. **Add to Frontend `index.html`**:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. **Deploy**: Push changes to trigger auto-deployment

---

## 🔒 Security Best Practices

### Already Implemented ✅

1. **HTTPS Everywhere** - Vercel provides automatic SSL
2. **CORS Configuration** - Restricts API access
3. **Environment Variables** - Secrets not in code
4. **Input Validation** - Pydantic models on backend

### Additional Security (Optional)

1. **Rate Limiting**:
```python
# backend/app.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/resume/upload")
@limiter.limit("10/minute")  # Max 10 uploads per minute
async def upload_resume():
    ...
```

2. **API Key Authentication** (if needed):
```python
# Require API key for batch analysis
API_KEY = os.getenv("API_KEY")

@app.post("/api/batch/analyze")
async def batch_analyze(api_key: str = Header(None)):
    if api_key != API_KEY:
        raise HTTPException(403, "Invalid API key")
    ...
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed successfully on Render
- [ ] Frontend deployed successfully on Vercel
- [ ] Backend URL updated in frontend `.env.production`
- [ ] CORS configured correctly in backend
- [ ] Test resume upload and analysis
- [ ] Test all features (Templates, ATS Check, Batch Analysis)
- [ ] Check browser console for errors
- [ ] Verify PDF download works
- [ ] Test on mobile device
- [ ] Set up cron job to prevent backend sleep (optional)
- [ ] Add custom domain (optional)
- [ ] Enable analytics (optional)
- [ ] Share with friends and get feedback!

---

## 🎉 Your Live URLs

After deployment, you'll have:

**Frontend**: `https://hirescope-frontend.vercel.app`
- Fast, global CDN
- Automatic HTTPS
- Preview deployments for every PR

**Backend**: `https://hirescope-backend.onrender.com`
- Free 750 hours/month
- Auto-deploy on push
- Detailed logs

**GitHub**: `https://github.com/ParthSharma272/HireScope`
- Source code
- Version control
- Collaboration

---

## 🚀 Next Steps

1. **Share Your Project**:
   - Add to portfolio
   - Share on LinkedIn
   - Post on Twitter/X
   - Submit to Product Hunt

2. **Get Feedback**:
   - Ask friends to test
   - Share in resume communities
   - Reddit: r/resumes, r/jobs

3. **Iterate**:
   - Monitor analytics
   - Fix bugs
   - Add requested features
   - Improve based on usage

4. **Scale**:
   - Monitor free tier limits
   - Upgrade if traffic grows
   - Consider adding monetization

---

## 📞 Support

**Deployment Issues?**

1. Check this guide first
2. Review Vercel/Render documentation
3. Check logs for error messages
4. Google the specific error
5. Ask on Stack Overflow with tags: `vercel`, `render`, `fastapi`, `react`

**Your Project Links**:
- **Live App**: [Your Vercel URL]
- **Backend API**: [Your Render URL]
- **GitHub**: https://github.com/ParthSharma272/HireScope
- **Portfolio**: https://portfolio-website-f311.vercel.app/

---

## 🎓 Resources

**Vercel**:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/guides/vite-on-vercel)

**Render**:
- [Render Documentation](https://render.com/docs)
- [Python on Render](https://render.com/docs/deploy-python)

**Tutorials**:
- [Deploy FastAPI to Render](https://render.com/docs/deploy-fastapi)
- [Deploy React to Vercel](https://vercel.com/guides/deploying-react-with-vercel)

---

**🎉 Congratulations! Your AI-powered resume analysis platform is now live and accessible to anyone in the world!**

**Built with ❤️ by Parth Sharma**

---

## Quick Command Reference

```bash
# Frontend Deployment
cd hirescope-frontend
vercel --prod

# Backend Check
curl https://hirescope-backend.onrender.com/api/health

# Git Deploy (triggers auto-deployment)
git add .
git commit -m "Update feature"
git push origin master:main

# Local Testing
cd backend && source venv/bin/activate && uvicorn app:app --reload
cd hirescope-frontend && npm run dev
```

**Last Updated**: November 1, 2025
**Version**: 2.0.0
