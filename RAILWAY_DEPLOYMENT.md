# 🚂 Railway Deployment Guide for HireScope

Railway offers a more generous free tier than Render, making it perfect for AI/ML applications.

---

## 🎁 Railway Free Tier (Better than Render!)

- **$5 free credits per month** (no credit card required initially)
- **8 GB RAM** (vs Render's 512 MB)
- **8 vCPU** shared
- **100 GB bandwidth**
- **No sleep/cold starts**
- Perfect for ML models!

---

## 🚀 Deploy to Railway

### Step 1: Sign Up

1. Go to [railway.app](https://railway.app)
2. Click "Login" → Sign up with GitHub
3. Authorize Railway to access your repositories

### Step 2: Create New Project

1. **Click "New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Choose your `HireScope` repository**
4. Railway will auto-detect the Python project

### Step 3: Configure Service

Railway auto-detects most settings, but you need to configure:

1. **Click on your service** (should be called "hirescope-backend" or similar)

2. **Go to "Settings" tab**

3. **Root Directory**:
   - Set to: `backend`

4. **Build Command** (if not auto-detected):
   ```bash
   pip install -r requirements.txt && python -m spacy download en_core_web_sm
   ```

5. **Start Command**:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

6. **Environment Variables** (Settings → Variables):
   ```
   PYTHON_VERSION=3.11
   ```

### Step 4: Generate Domain

1. **Go to "Settings" → "Networking"**
2. **Click "Generate Domain"**
3. **Copy your Railway URL**: `https://hirescope-backend-production.up.railway.app`

### Step 5: Deploy

1. **Railway automatically deploys on push to main branch**
2. **Watch deployment logs in real-time**
3. **First deployment takes 5-10 minutes**

---

## 🔧 Update Frontend to Use Railway Backend

### Update `.env.production`

```bash
cd /Users/parth/Desktop/HireScope/hirescope-frontend

# Edit .env.production
nano .env.production
```

Update with your Railway URL:
```env
VITE_API_URL=https://hirescope-backend-production.up.railway.app
VITE_APP_NAME=HireScope
VITE_APP_VERSION=2.0.0
```

### Commit and Push

```bash
git add hirescope-frontend/.env.production
git commit -m "Update production API URL to Railway"
git push origin master:main
```

---

## 🔐 Update CORS in Backend

Update `backend/app.py` to include your Railway URL:

```python
origins = [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "https://*.vercel.app",
    "https://hirescope-frontend.vercel.app",
    "https://*.railway.app",  # Add Railway domains
]
```

Commit and push - Railway will auto-deploy:
```bash
git add backend/app.py
git commit -m "Add Railway domains to CORS"
git push origin master:main
```

---

## ✅ Test Deployment

### Test Backend

```bash
# Health check
curl https://YOUR-RAILWAY-URL.up.railway.app/api/health

# Expected response:
# {"status":"ok","version":"2.0.0"}
```

### Test Frontend

1. Deploy frontend to Vercel (as before)
2. Update `VITE_API_URL` to point to Railway
3. Test all features

---

## 📊 Railway vs Render Comparison

| Feature | Railway (Free) | Render (Free) |
|---------|----------------|---------------|
| **RAM** | **8 GB** 🎉 | 512 MB ❌ |
| **CPU** | 8 vCPU (shared) | Shared |
| **Credits** | $5/month | N/A |
| **Bandwidth** | 100 GB | Unlimited |
| **Cold Starts** | **None** ✅ | After 15 min ❌ |
| **Build Time** | Fast | Slow |
| **ML Models** | **Perfect** ✅ | Too small ❌ |

**Winner: Railway** 🚂 for AI/ML applications!

---

## 🎯 Why Railway is Better for HireScope

1. **8 GB RAM** - Easily handles sentence-transformers models
2. **No cold starts** - Always-on, instant responses
3. **Better build times** - Faster deployments
4. **ML-friendly** - Designed for modern Python apps
5. **Developer experience** - Better UI, logs, and monitoring

---

## 💰 Cost After Free Tier

**Railway Hobby Plan**: $5/month gets you:
- **512 MB RAM** (should be enough after free tier expires)
- **More credits**
- **Priority support**

**vs Render Starter**: $7/month for less features

---

## 🔄 Auto-Deploy Setup

Railway automatically deploys on every push to `main` branch!

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin master:main

# Railway auto-deploys (2-3 minutes)
# Watch in Railway dashboard
```

---

## 📝 Railway Configuration Files

### Option 1: `railway.json` (Created for you)

Already created at project root:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt && python -m spacy download en_core_web_sm"
  },
  "deploy": {
    "startCommand": "uvicorn app:app --host 0.0.0.0 --port $PORT"
  }
}
```

### Option 2: Use Dashboard (Recommended)

Railway auto-detects Python projects, so you can configure everything in the dashboard.

---

## 🐛 Troubleshooting

### Build Fails

**Check Railway logs**:
- Dashboard → Your Service → "Deployments" → Click latest deployment
- View build logs in real-time

**Common issues**:
- Missing dependencies in `requirements.txt`
- Python version mismatch

### Memory Issues (unlikely with 8GB!)

If you somehow exceed 8GB:
1. Check for memory leaks
2. Optimize model loading
3. Use Railway Hobby plan for more resources

### Port Binding Issues

Railway provides `$PORT` environment variable automatically. Make sure start command uses it:
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

---

## 🎉 Quick Start Checklist

- [ ] Sign up at railway.app with GitHub
- [ ] Create new project from GitHub repo
- [ ] Configure root directory to `backend`
- [ ] Generate domain in Settings → Networking
- [ ] Copy Railway URL
- [ ] Update frontend `.env.production` with Railway URL
- [ ] Update CORS in `backend/app.py` with Railway domain
- [ ] Push changes to trigger auto-deploy
- [ ] Test backend health endpoint
- [ ] Deploy frontend to Vercel
- [ ] Test full application

---

## 🔗 Additional Railway Services

You can also deploy frontend to Railway (optional):

1. **Create second service** for frontend
2. **Root directory**: `hirescope-frontend`
3. **Build command**: `npm install && npm run build`
4. **Start command**: `npm run preview` or use static site hosting

**But Vercel is still better for frontend** due to:
- Global CDN
- Better performance
- Specialized for React/Vite

---

## 📞 Railway Support

- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Status**: [status.railway.app](https://status.railway.app)

---

## 🎊 Summary

**Perfect Setup**:
- ✅ **Backend on Railway** (8 GB RAM, no cold starts)
- ✅ **Frontend on Vercel** (fast CDN, optimized for React)
- ✅ **Total cost**: $0/month (within free tiers)
- ✅ **All features working**: Templates, ATS, Batch Analysis

**Your URLs**:
```
Frontend: https://hirescope-frontend.vercel.app
Backend:  https://hirescope-backend-production.up.railway.app
```

---

**🚂 Deploy to Railway now and enjoy 8 GB of RAM for your AI models!**

**Last Updated**: November 1, 2025
