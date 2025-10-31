# HireScope - Quick Start Guide

## 🚀 Running the Application

### Backend Server
```bash
cd /Users/parth/Desktop/HireScope/backend
source venv/bin/activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Server
```bash
cd /Users/parth/Desktop/HireScope/hirescope-frontend
npm run dev
```

**Current URLs**:
- Frontend: http://localhost:5175/
- Backend API: http://127.0.0.1:8000
- API Health: http://127.0.0.1:8000/api/health

## 📁 New UI File Structure

```
hirescope-frontend/src/
├── App.jsx                      # Main app with routing logic
├── components/
│   ├── Hero.jsx                # Landing section
│   ├── UploadZone.jsx          # File upload interface
│   └── ResultsDashboard.jsx    # Results display
├── index.css                   # Global styles + utilities
└── main.jsx                    # Entry point
```

## 🎨 What's New

### Visual Improvements
✅ Glass-morphism design (frosted glass cards)
✅ Gradient backgrounds and text
✅ Smooth animations (fade-in, slide-up, scale-in)
✅ Modern color palette (indigo, purple, blue)
✅ Professional typography

### Component Features
✅ **Hero Section**: Value proposition with feature badges
✅ **Drag & Drop Upload**: Visual feedback for file upload
✅ **Radial Score Chart**: Color-coded overall match score
✅ **Score Breakdown**: 3 detailed metric cards
✅ **Keyword Analysis**: Green badges (matched) + Red badges (missing)
✅ **AI Insights**: Clean prose layout with recommendations

### User Experience
✅ Page transitions with AnimatePresence
✅ Loading states with spinners
✅ Error messages with icons
✅ Responsive design (mobile, tablet, desktop)
✅ "Analyze Another Resume" button

## 🎯 User Journey

1. **Hero Section**
   - See value proposition
   - Understand AI capabilities
   - View feature checklist

2. **Upload Interface**
   - Drag-drop resume (PDF/DOCX)
   - Paste job description
   - Click "Analyze Resume"

3. **Analysis**
   - See loading spinner
   - "Analyzing..." state

4. **Results Dashboard**
   - Overall score (radial chart)
   - Score breakdown (3 cards)
   - Keyword analysis (matched/missing)
   - AI-powered insights
   - Action button to restart

## 🎨 Design System

### Colors
- **Primary**: Indigo (#4F46E5)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Animations
- `animate-fade-in`: Smooth opacity transition
- `animate-slide-up`: Upward motion on load
- `animate-scale-in`: Scale from 95% to 100%

### Effects
- `glass-effect`: Frosted glass card style
- `gradient-text`: Gradient text with clip
- `shadow-glass`: Soft shadow for depth
- `shadow-card`: Card elevation shadow

## 🔧 Technical Details

### Dependencies Used
- **React 19.1.1**: Core framework
- **Framer Motion**: Animations & transitions
- **Recharts**: Radial bar chart
- **Heroicons**: Icon library
- **Tailwind CSS 3.4**: Utility-first styling
- **Axios**: HTTP requests

### API Integration
- Endpoint: `POST http://127.0.0.1:8000/api/resume/upload`
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: Resume file (PDF/DOCX)
  - `job_description`: Job description text

### Response Structure
```json
{
  "scores": {
    "overall_score": 0.85,
    "content_quality_score": 0.82,
    "keyword_match_score": 0.88,
    "semantic_relevance_score": 0.85
  },
  "keyword_analysis": {
    "required": ["python", "react", "aws"],
    "matched": ["python", "react"],
    "missing": ["aws"],
    "matches": {
      "python": ["Python 3.x experience"],
      "react": ["React.js development"]
    }
  },
  "insights": "Your resume shows strong technical skills..."
}
```

## 📱 Responsive Breakpoints

- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640px - 1024px): 2-column grids
- **Desktop** (> 1024px): 3-column grids, full layout

## 🐛 Troubleshooting

### Backend Not Running
```bash
# Check if port 8000 is in use
lsof -ti:8000 | xargs kill -9

# Restart backend
cd /Users/parth/Desktop/HireScope/backend
source venv/bin/activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Build Errors
```bash
# Clear node_modules and reinstall
cd /Users/parth/Desktop/HireScope/hirescope-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS Issues
Backend already has CORS configured:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Performance Tips

1. **Animations**: Use `will-change` sparingly (already optimized)
2. **Images**: Use WebP format for decorative elements
3. **Charts**: Recharts renders on-demand (no preloading)
4. **Lazy Loading**: Consider React.lazy() for components if needed

## 🎯 Testing Checklist

- [ ] Upload PDF resume
- [ ] Upload DOCX resume
- [ ] Paste job description
- [ ] Submit form
- [ ] View loading state
- [ ] See results dashboard
- [ ] Check radial chart rendering
- [ ] Verify keyword badges
- [ ] Read AI insights
- [ ] Click "Analyze Another Resume"
- [ ] Test on mobile device
- [ ] Test drag-and-drop upload

## 🌟 Design Inspiration

The new UI takes inspiration from:
- **EnhanceCV**: Clean, modern card-based design
- **Resume.io**: Professional color palette and typography
- **FlowCV**: Smooth animations and transitions
- **MyPerfectResume**: Clear data visualization
- **Resume Worded**: Actionable insights presentation

## 📝 Notes

- **ESLint Warnings**: `@apply` directive warnings are false positives (Tailwind syntax)
- **Port Changes**: Frontend may use 5175 if 5173/5174 are occupied
- **Background Processes**: Use `kill -9 <PID>` to stop lingering servers
- **Hot Reload**: Both servers support hot module replacement
