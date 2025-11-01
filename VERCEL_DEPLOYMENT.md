# 🚀 Deploy Frontend to Vercel

## Quick Deploy Steps

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com/
2. **Sign in** with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select repository: `ParthSharma272/HireScope`
5. Click **"Import"**

### Configuration

**Build Settings:**
```
Framework Preset: Vite
Root Directory: hirescope-frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**
```
VITE_API_URL = https://arcadian27-hirescope-backend.hf.space
VITE_APP_NAME = HireScope
VITE_APP_VERSION = 2.0.0
```

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. Get your live URL!

---

## Method 2: Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy

```bash
cd /Users/parth/Desktop/HireScope/hirescope-frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Follow the prompts:
- Project setup? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **hirescope-frontend**
- Directory? **. (current)**
- Override build command? **N**
- Override output directory? **N**

---

## After Deployment

### Test Your App

1. Visit your Vercel URL
2. Upload a test resume
3. Paste a job description
4. Click "Analyze Resume"
5. Verify results display correctly

### Update Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Troubleshooting

### Build Fails

- Check `package.json` is in `hirescope-frontend/`
- Verify all dependencies are listed
- Check build logs in Vercel dashboard

### API Not Connecting

- Verify `VITE_API_URL` environment variable
- Check CORS settings in backend
- Test backend: `curl https://arcadian27-hirescope-backend.hf.space/api/health`

### Runtime Errors

- Check browser console for errors
- Verify environment variables are set
- Check Network tab for API call failures

---

## Your Deployment URLs

**Backend**: https://arcadian27-hirescope-backend.hf.space
**Frontend**: (Will be) https://hirescope-frontend.vercel.app

---

**Last Updated**: November 1, 2025
