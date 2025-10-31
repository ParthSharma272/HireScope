import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LightBulbIcon, 
  ChartBarIcon, 
  SparklesIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";

export default function ResumeTips() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Tips", icon: SparklesIcon },
    { id: "ats", name: "ATS Tips", icon: ChartBarIcon },
    { id: "keywords", name: "Keywords", icon: DocumentTextIcon },
    { id: "formatting", name: "Formatting", icon: AcademicCapIcon },
    { id: "content", name: "Content", icon: BriefcaseIcon }
  ];

  const tips = [
    {
      category: "ats",
      title: "How ATS Systems Read Your Resume (And What Gets Ignored)",
      excerpt: "Learn why 75% of resumes never reach human eyes and how to beat automated filters.",
      readTime: "5 min read",
      date: "Oct 30, 2025",
      content: `
## The ATS Reality Check

Did you know that 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them? Here's what you need to know:

### What ATS Systems Can't Read:
- **Tables and columns** - Use single-column layouts
- **Headers/footers** - Keep contact info in the main body
- **Images and graphics** - Including your photo, logos, or charts
- **Special characters** - Stick to standard bullets (•)
- **Fancy fonts** - Use Arial, Calibri, or Times New Roman

### What ATS Systems Love:
1. **Standard section headings** - "Work Experience", "Education", "Skills"
2. **Keywords from job description** - Mirror the exact terminology
3. **Consistent date formats** - Use "Jan 2023" or "01/2023" throughout
4. **Simple bullet points** - Clear, scannable lists
5. **Plain text** - .docx format works best

### Pro Tip:
Test your resume by copying it into a plain text editor (Notepad). If the formatting looks broken, the ATS will struggle too!

**Action Item:** Remove all tables, images, and fancy formatting from your resume today.
      `,
      tags: ["ATS", "Formatting", "Best Practices"]
    },
    {
      category: "keywords",
      title: "The Ultimate Guide to Resume Keywords That Get You Hired",
      excerpt: "Strategic keyword placement can 3x your interview callbacks. Here's the formula.",
      readTime: "7 min read",
      date: "Oct 28, 2025",
      content: `
## Keyword Mastery: Your Secret Weapon

Keywords are the bridge between you and your dream job. Here's how to use them strategically:

### The 3-Type Keyword Framework:

#### 1. Hard Skills (Technical Keywords)
- Programming languages: Python, JavaScript, SQL
- Tools & platforms: AWS, Docker, Salesforce
- Certifications: PMP, CPA, AWS Certified

**Where to place:** Skills section, bullet points, summary

#### 2. Soft Skills (Behavioral Keywords)
- Leadership, teamwork, communication
- Problem-solving, critical thinking
- Time management, adaptability

**Where to place:** Achievement descriptions, summary

#### 3. Industry Keywords (Domain Terminology)
- Agile/Scrum for tech
- GAAP for accounting  
- ROI, KPIs for business

**Where to place:** Throughout work experience

### Keyword Optimization Formula:

1. **Extract keywords from job description** (15-20 keywords)
2. **Match 70-80% of those keywords** in your resume
3. **Use exact phrases** from the job posting
4. **Include variations** (e.g., "ML" AND "Machine Learning")
5. **Front-load keywords** in first third of resume

### Example Transformation:

❌ Before: "Managed projects"
✅ After: "Led cross-functional Agile projects using Jira and Confluence"

**Action Item:** Make a spreadsheet with 20 keywords from your target job description, then check how many are in your resume.
      `,
      tags: ["Keywords", "Optimization", "Strategy"]
    },
    {
      category: "content",
      title: "How to Quantify Your Achievements (Even Without Hard Numbers)",
      excerpt: "Numbers make your resume 40% more compelling. Here's how to find them.",
      readTime: "6 min read",
      date: "Oct 25, 2025",
      content: `
## The Power of Quantification

Resumes with quantified achievements get 40% more callbacks. But what if you don't have obvious metrics?

### The STAR Method for Quantification:

**S**ituation - What was the challenge?
**T**ask - What was your responsibility?
**A**ction - What did you do?
**R**esult - What was the measurable impact?

### 10 Ways to Find Your Numbers:

1. **Team Size** - "Led team of 8 developers"
2. **Time Saved** - "Reduced processing time by 3 hours/day"
3. **Money Saved/Earned** - "Cut costs by $50K annually"
4. **Percentage Improvements** - "Increased efficiency by 35%"
5. **Volume** - "Processed 200+ customer requests weekly"
6. **Scale** - "Managed $2M budget"
7. **Growth** - "Grew user base from 5K to 15K"
8. **Frequency** - "Published 3 reports monthly"
9. **Scope** - "Implemented across 12 departments"
10. **Rankings** - "Ranked top 10% in sales region"

### Examples by Role:

**Software Engineer:**
❌ "Improved application performance"
✅ "Optimized database queries, reducing page load time by 60% (2.5s to 1.0s) for 50K daily users"

**Marketing Manager:**
❌ "Managed social media"
✅ "Grew Instagram following 180% (10K to 28K) in 6 months through data-driven content strategy"

**Project Manager:**
❌ "Delivered projects on time"
✅ "Launched 8 projects ahead of schedule (avg 2 weeks early), saving $120K in resources"

**Action Item:** Go through each bullet point and add at least one number. If you can't remember exact figures, use reasonable estimates.
      `,
      tags: ["Content", "Achievements", "Writing Tips"]
    },
    {
      category: "formatting",
      title: "The Perfect Resume Format: Single-Page vs Multi-Page Debate Solved",
      excerpt: "When to use 1 page vs 2 pages, and how to format each section perfectly.",
      readTime: "4 min read",
      date: "Oct 22, 2025",
      content: `
## Resume Length: The Definitive Answer

The "one-page rule" is outdated. Here's when to use what:

### One Page Resume (Use When):
- 0-5 years experience
- Career changers
- Recent graduates
- Applying to startups/tech

### Two Page Resume (Use When):
- 5+ years experience
- Academic positions
- Executive roles
- Multiple relevant positions

### The Golden Rules:

#### Page 1 Must Include:
1. Contact information
2. Professional summary (2-3 lines)
3. Top 2-3 most recent/relevant positions
4. Key skills section
5. Education (if recent graduate)

#### Page 2 Can Include:
- Additional work experience
- Projects & publications
- Certifications & training
- Volunteer work & leadership

### Section Order (Priority Top to Bottom):

1. **Header** (Name, Phone, Email, LinkedIn, Location)
2. **Professional Summary** (3 sentences max)
3. **Work Experience** (reverse chronological)
4. **Skills** (grouped by category)
5. **Education** (move up if recent grad)
6. **Certifications** (if relevant to role)
7. **Projects** (for tech roles)
8. **Additional** (languages, publications, etc.)

### Formatting Checklist:

✅ Margins: 0.5-1 inch all sides
✅ Font size: 10-12pt body, 14-16pt name
✅ Font: Arial, Calibri, or Garamond
✅ Line spacing: 1.0-1.15
✅ Bullet points: Consistent style
✅ White space: 20-30% of page
✅ No: photos, colors (except subtle accents), graphics

**Action Item:** Print your resume and ask: "Can I skim this in 6 seconds?" If not, reduce content or improve formatting.
      `,
      tags: ["Formatting", "Layout", "Best Practices"]
    },
    {
      category: "ats",
      title: "5 ATS-Friendly Resume Hacks Recruiters Don't Want You to Know",
      excerpt: "Insider tricks to rank higher in ATS systems and get your resume seen.",
      readTime: "5 min read",
      date: "Oct 20, 2025",
      content: `
## ATS Hacks That Actually Work

Here are 5 proven tactics to beat Applicant Tracking Systems:

### 1. The "White Text" Keyword Hack
❌ **DON'T DO THIS** - Adding white text with keywords is detectable and will get you blacklisted

✅ **DO THIS INSTEAD** - Naturally integrate keywords into your summary and bullet points

### 2. The Job Title Alignment Strategy
If you're a "Software Developer" applying for "Software Engineer" roles:

Add a line in your summary:
"Software Engineer / Software Developer with 5+ years..."

This helps ATS match both terms without lying.

### 3. The Acronym Double-Down
Always spell out acronyms on first use, then use the acronym:

"Project Management Professional (PMP) certified..."

Later: "Applied PMP methodologies..."

### 4. The Skills Section Multiplier
Create TWO skills sections:

**Technical Skills:** Hard skills, tools, languages
**Core Competencies:** Soft skills, methodologies

This doubles your keyword coverage without redundancy.

### 5. The Format Test
Before submitting:
1. Save as .docx (best ATS compatibility)
2. Upload to Jobscan or similar ATS simulator
3. Check keyword match rate (aim for 70-80%)
4. Adjust and retest

### Bonus Hack: The File Name Optimization

❌ "Resume.docx"
✅ "John-Smith-Software-Engineer-Resume.docx"

Some ATS systems scan file names for keywords!

**Action Item:** Run your resume through Jobscan.co (free) against 3 target job descriptions. Fix anything under 70% match.
      `,
      tags: ["ATS", "Strategy", "Optimization"]
    },
    {
      category: "content",
      title: "Power Verbs That Make Recruiters Take Notice (150+ Examples)",
      excerpt: "Replace weak verbs with powerful action words that showcase leadership and impact.",
      readTime: "8 min read",
      date: "Oct 18, 2025",
      content: `
## The Power Verb Revolution

Weak verbs kill resumes. Strong verbs get you hired.

### ❌ Overused Weak Verbs to Avoid:
- Responsible for
- Worked on
- Helped with
- Participated in
- Assisted with

### ✅ Power Verbs by Category:

#### Leadership (7 Best):
- Spearheaded
- Orchestrated
- Pioneered
- Championed
- Mobilized
- Galvanized
- Steered

#### Achievement (10 Best):
- Accelerated
- Exceeded
- Surpassed
- Amplified
- Maximized
- Outperformed
- Elevated
- Catapulted
- Revolutionized
- Transformed

#### Technical (12 Best):
- Engineered
- Architected
- Debugged
- Optimized
- Refactored
- Deployed
- Automated
- Integrated
- Migrated
- Configured
- Implemented
- Streamlined

#### Strategy (8 Best):
- Formulated
- Devised
- Strategized
- Conceptualized
- Forecasted
- Analyzed
- Synthesized
- Diagnosed

#### Communication (6 Best):
- Articulated
- Negotiated
- Persuaded
- Presented
- Advocated
- Evangelized

### Before/After Examples:

❌ "Responsible for managing a team"
✅ "Spearheaded cross-functional team of 12"

❌ "Helped improve sales"
✅ "Accelerated sales growth by 35% YoY"

❌ "Worked on website performance"
✅ "Optimized web application, reducing load time 60%"

### The Formula:
**Power Verb + What + Result**

Example: "Orchestrated migration of 50TB database, reducing query time by 40%"

**Action Item:** Replace all weak verbs in your resume today. Aim for 15+ unique power verbs.
      `,
      tags: ["Content", "Writing", "Action Verbs"]
    }
  ];

  const filteredTips = selectedCategory === "all" 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Resume Tips & <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Expert Guides</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn from industry experts. Free, actionable advice to transform your resume and land more interviews.
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTips.map((tip, idx) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-effect rounded-2xl p-6 shadow-card hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => {
              // In a real app, this would navigate to a dedicated blog post page
              alert(`Full article would open here!\n\nTitle: ${tip.title}\n\nIn a production app, this would navigate to a dedicated blog post page or open a modal with the full content.`);
            }}
          >
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold uppercase">
                {tip.category}
              </span>
              <span className="text-sm text-gray-500">{tip.readTime}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
              {tip.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 line-clamp-2">
              {tip.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tip.tags.map((tag, i) => (
                <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">{tip.date}</span>
              <span className="text-purple-600 font-semibold group-hover:underline flex items-center gap-1">
                Read More
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white"
      >
        <LightBulbIcon className="w-12 h-12 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-bold mb-3">Ready to Apply These Tips?</h3>
        <p className="text-purple-100 mb-6 max-w-xl mx-auto">
          Upload your resume now and get personalized AI-powered suggestions based on these best practices.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Analyze My Resume Free
        </button>
      </motion.div>
    </div>
  );
}
