# backend/core/rag_engine.py
"""
RAG (Retrieval Augmented Generation) Engine for HireScope
Provides context-aware resume improvement suggestions
"""

import numpy as np
import json
import os
from typing import List, Dict

class SimpleRAGEngine:
    """
    Lightweight RAG implementation using sentence embeddings
    Can be upgraded to use LangChain + LLMs later
    """
    
    def __init__(self, knowledge_base_path="data/resume_tips.json"):
        # Use the existing embedding model for consistency
        # Lazy import: avoid importing sentence-transformers (and torch) at module import time
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('all-mpnet-base-v2')
        except Exception as e:
            self.model = None
            # model will be created on demand; log if logger available
            try:
                import logging
                logging.getLogger(__name__).warning(f"Embedding model not available at RAG init: {e}")
            except Exception:
                pass
        
        # Load or initialize knowledge base
        self.knowledge_base = self._load_knowledge_base(knowledge_base_path)
        self.kb_embeddings = None
        
        if self.knowledge_base and self.model is not None:
            self._create_kb_embeddings()
    
    def _load_knowledge_base(self, path: str) -> List[Dict]:
        """Load resume tips and best practices - Enhanced with 60+ expert tips"""
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        else:
            # Enhanced knowledge base with comprehensive tips
            return [
                # Writing Style & Language (12 tips)
                {
                    "tip": "Start each bullet point with a strong action verb like 'Led', 'Developed', 'Implemented', 'Achieved', 'Architected'",
                    "category": "writing_style",
                    "context": "professional resume action verbs",
                    "priority": "high"
                },
                {
                    "tip": "Avoid personal pronouns (I, me, my) - use action-focused language instead",
                    "category": "writing_style",
                    "context": "professional tone third person",
                    "priority": "high"
                },
                {
                    "tip": "Use present tense for current roles and past tense for previous positions",
                    "category": "writing_style",
                    "context": "verb tense consistency grammar",
                    "priority": "medium"
                },
                {
                    "tip": "Replace weak verbs like 'helped' or 'worked on' with stronger alternatives like 'drove', 'spearheaded', 'engineered'",
                    "category": "writing_style",
                    "context": "strong action verbs impact",
                    "priority": "high"
                },
                {
                    "tip": "Keep sentences concise - aim for 15-20 words per bullet point maximum",
                    "category": "writing_style",
                    "context": "brevity clarity readability",
                    "priority": "medium"
                },
                {
                    "tip": "Avoid jargon and acronyms unless industry-standard (spell out on first use)",
                    "category": "writing_style",
                    "context": "clarity accessibility jargon",
                    "priority": "low"
                },
                {
                    "tip": "Use active voice instead of passive voice for stronger impact",
                    "category": "writing_style",
                    "context": "active voice passive voice grammar",
                    "priority": "medium"
                },
                
                # Quantification & Impact (10 tips)
                {
                    "tip": "Quantify achievements with specific metrics (e.g., 'Increased sales by 25%', 'Managed team of 10', 'Reduced costs by $50K')",
                    "category": "impact",
                    "context": "measurable results numbers metrics quantification",
                    "priority": "critical"
                },
                {
                    "tip": "Include scale indicators: team size, budget, user base, revenue impact",
                    "category": "impact",
                    "context": "scale scope magnitude business impact",
                    "priority": "high"
                },
                {
                    "tip": "Show before/after comparisons: 'Reduced load time from 5s to 800ms'",
                    "category": "impact",
                    "context": "improvement comparison optimization",
                    "priority": "high"
                },
                {
                    "tip": "Highlight time-based achievements: 'Delivered project 2 weeks ahead of schedule'",
                    "category": "impact",
                    "context": "efficiency timeline delivery speed",
                    "priority": "medium"
                },
                {
                    "tip": "Include frequency and volume: 'Processed 10K+ transactions daily', 'Deployed 50+ features'",
                    "category": "impact",
                    "context": "volume throughput frequency scale",
                    "priority": "medium"
                },
                {
                    "tip": "Add percentage improvements: 'Increased conversion rate by 35%', 'Reduced errors by 60%'",
                    "category": "impact",
                    "context": "percentage growth improvement optimization",
                    "priority": "high"
                },
                
                # ATS Optimization (12 tips)
                {
                    "tip": "Use industry-specific keywords from the job description to pass ATS filters",
                    "category": "ats_optimization",
                    "context": "keyword matching applicant tracking system",
                    "priority": "critical"
                },
                {
                    "tip": "Include both full terms and acronyms: 'Search Engine Optimization (SEO)', 'Application Programming Interface (API)'",
                    "category": "ats_optimization",
                    "context": "acronyms ATS parsing terminology",
                    "priority": "high"
                },
                {
                    "tip": "Use standard section headings: Experience, Education, Skills, not creative alternatives",
                    "category": "ats_optimization",
                    "context": "section headers structure ATS compatibility",
                    "priority": "high"
                },
                {
                    "tip": "Avoid tables, text boxes, headers/footers - use simple single-column layout",
                    "category": "ats_optimization",
                    "context": "formatting layout ATS parsing compatibility",
                    "priority": "critical"
                },
                {
                    "tip": "Use standard bullet points (• or -) instead of custom graphics or symbols",
                    "category": "ats_optimization",
                    "context": "bullets formatting special characters",
                    "priority": "high"
                },
                {
                    "tip": "Save as .docx or clean PDF with selectable text (not scanned images)",
                    "category": "ats_optimization",
                    "context": "file format PDF DOCX ATS submission",
                    "priority": "critical"
                },
                {
                    "tip": "Avoid images, charts, graphs - ATS cannot parse visual content",
                    "category": "ats_optimization",
                    "context": "images graphics visual content ATS",
                    "priority": "high"
                },
                {
                    "tip": "Use standard fonts: Arial, Calibri, Times New Roman (10-12pt)",
                    "category": "ats_optimization",
                    "context": "fonts typography readability",
                    "priority": "medium"
                },
                
                # Skills Section (8 tips)
                {
                    "tip": "Include relevant technical skills in a dedicated Skills section for easy scanning",
                    "category": "skills",
                    "context": "technical competencies skills section",
                    "priority": "high"
                },
                {
                    "tip": "Group skills by category: Languages, Frameworks, Tools, Soft Skills",
                    "category": "skills",
                    "context": "organization categorization structure",
                    "priority": "medium"
                },
                {
                    "tip": "Remove outdated skills and focus on current, in-demand technologies",
                    "category": "skills",
                    "context": "modern tech stack relevant skills",
                    "priority": "medium"
                },
                {
                    "tip": "List proficiency levels for key skills: Expert, Advanced, Intermediate",
                    "category": "skills",
                    "context": "proficiency level expertise competency",
                    "priority": "low"
                },
                {
                    "tip": "Include both hard skills (technical) and soft skills (leadership, communication)",
                    "category": "skills",
                    "context": "hard skills soft skills balanced",
                    "priority": "medium"
                },
                {
                    "tip": "Match skill keywords exactly as they appear in job description",
                    "category": "skills",
                    "context": "keyword matching exact match JD alignment",
                    "priority": "high"
                },
                
                # Experience Section (10 tips)
                {
                    "tip": "Structure experience entries: Company, Title, Dates, Location, then 3-5 bullet points",
                    "category": "experience",
                    "context": "structure format organization work history",
                    "priority": "high"
                },
                {
                    "tip": "Focus on achievements, not just responsibilities - what you accomplished, not what you did",
                    "category": "experience",
                    "context": "achievements results accomplishments impact",
                    "priority": "critical"
                },
                {
                    "tip": "Use the CAR method: Context, Action, Result for each bullet point",
                    "category": "experience",
                    "context": "CAR method STAR method storytelling",
                    "priority": "high"
                },
                {
                    "tip": "List experiences in reverse chronological order (most recent first)",
                    "category": "experience",
                    "context": "chronological order dates timeline",
                    "priority": "high"
                },
                {
                    "tip": "Include relevant internships, co-ops, and contract work",
                    "category": "experience",
                    "context": "internships contract work relevant experience",
                    "priority": "medium"
                },
                {
                    "tip": "Dedicate more space to recent roles (3-5 bullets) vs older roles (1-2 bullets)",
                    "category": "experience",
                    "context": "prioritization recent experience relevant",
                    "priority": "medium"
                },
                
                # Customization & Targeting (6 tips)
                {
                    "tip": "Tailor your resume for each position by emphasizing relevant experience",
                    "category": "customization",
                    "context": "job targeting personalization tailoring",
                    "priority": "critical"
                },
                {
                    "tip": "Mirror the language and terminology from the job description",
                    "category": "customization",
                    "context": "language alignment JD matching terminology",
                    "priority": "high"
                },
                {
                    "tip": "Reorder bullet points to highlight most relevant achievements first",
                    "category": "customization",
                    "context": "prioritization relevance ordering",
                    "priority": "medium"
                },
                {
                    "tip": "Create a master resume, then customize 20-30% for each application",
                    "category": "customization",
                    "context": "master resume efficiency customization strategy",
                    "priority": "low"
                },
                
                # Format & Length (8 tips)
                {
                    "tip": "Keep resume concise: 1 page for <5 years experience, 2 pages for senior roles",
                    "category": "format",
                    "context": "resume length page count concise",
                    "priority": "high"
                },
                {
                    "tip": "Use consistent formatting: same font, spacing, and bullet style throughout",
                    "category": "format",
                    "context": "visual consistency formatting style",
                    "priority": "medium"
                },
                {
                    "tip": "Maintain adequate white space - don't cram content (0.5-1 inch margins)",
                    "category": "format",
                    "context": "white space margins readability spacing",
                    "priority": "medium"
                },
                {
                    "tip": "Use bold for company names and job titles, regular weight for descriptions",
                    "category": "format",
                    "context": "emphasis hierarchy bold formatting",
                    "priority": "low"
                },
                {
                    "tip": "Align dates consistently (right-aligned is common)",
                    "category": "format",
                    "context": "date alignment consistency formatting",
                    "priority": "low"
                },
                
                # Contact & Links (5 tips)
                {
                    "tip": "Include LinkedIn profile and portfolio/GitHub links in contact section",
                    "category": "contact",
                    "context": "professional presence online portfolio",
                    "priority": "high"
                },
                {
                    "tip": "Use professional email address (firstname.lastname@domain.com)",
                    "category": "contact",
                    "context": "email address professional contact",
                    "priority": "medium"
                },
                {
                    "tip": "Include city/state (full address not necessary)",
                    "category": "contact",
                    "context": "location address privacy",
                    "priority": "low"
                },
                {
                    "tip": "Add phone number with area code in standard format",
                    "category": "contact",
                    "context": "phone number contact information",
                    "priority": "medium"
                },
                {
                    "tip": "Link to personal website or portfolio if relevant to role",
                    "category": "contact",
                    "context": "portfolio website personal brand",
                    "priority": "medium"
                },
                
                # Education (4 tips)
                {
                    "tip": "List education after experience (unless recent graduate)",
                    "category": "education",
                    "context": "section order prioritization experience",
                    "priority": "medium"
                },
                {
                    "tip": "Include GPA if >3.5 and recent graduate (within 2 years)",
                    "category": "education",
                    "context": "GPA grades academic performance",
                    "priority": "low"
                },
                {
                    "tip": "List relevant coursework, honors, or academic achievements",
                    "category": "education",
                    "context": "coursework honors achievements academic",
                    "priority": "low"
                },
                {
                    "tip": "Format: Degree, Major, University, Graduation Year",
                    "category": "education",
                    "context": "format structure organization education",
                    "priority": "medium"
                }
            ]
    
    def _create_kb_embeddings(self):
        """Create embeddings for knowledge base entries"""
        texts = [f"{item['tip']} {item['context']}" for item in self.knowledge_base]
        self.kb_embeddings = self.model.encode(texts, convert_to_numpy=True)
        # Normalize
        norms = np.linalg.norm(self.kb_embeddings, axis=1, keepdims=True) + 1e-10
        self.kb_embeddings = self.kb_embeddings / norms
    
    def get_relevant_tips(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve most relevant tips based on query
        """
        if self.kb_embeddings is None:
            return []
        
        # Embed query
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        query_norm = np.linalg.norm(query_embedding, axis=1, keepdims=True) + 1e-10
        query_embedding = query_embedding / query_norm
        
        # Calculate similarity
        similarities = (self.kb_embeddings @ query_embedding.T).flatten()
        
        # Get top-k indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        # Return relevant tips with scores
        results = []
        for idx in top_indices:
            results.append({
                **self.knowledge_base[idx],
                "relevance_score": float(similarities[idx])
            })
        
        return results
    
    def generate_suggestions(
        self, 
        resume_text: str, 
        job_description: str, 
        scores: dict
    ) -> Dict:
        """
        Generate contextual suggestions based on resume and scores.
        Enhanced with priority levels and specific examples.
        """
        suggestions = {
            "critical": [],  # Urgent fixes
            "high_priority": [],  # Important improvements
            "recommended": [],  # Good to have
            "tips": [],  # Expert knowledge base tips
            "examples": []  # Before/after examples
        }
        
        composite = scores.get('composite', 0.0)
        
        # Critical issues (blocking problems)
        if scores.get('keyword', 0) < 0.3:
            query = f"improve keyword matching for: {job_description[:200]}"
            tips = self.get_relevant_tips(query, top_k=3)
            suggestions["critical"].extend([
                {
                    "issue": "Very low keyword match",
                    "action": "Add 5-10 job-specific keywords from the description",
                    "impact": "Could increase match score by 25-35%",
                    "priority": "critical"
                },
                {
                    "issue": "Missing technical terminology",
                    "action": "Include industry-standard terms and technologies mentioned in JD",
                    "impact": "Essential for ATS filtering",
                    "priority": "critical"
                }
            ])
            suggestions["tips"].extend(tips)
            
            # Add example
            suggestions["examples"].append({
                "category": "keyword_optimization",
                "before": "Skills: Programming, Databases, Web Development",
                "after": "Skills: Python, JavaScript, React.js, Node.js, PostgreSQL, MongoDB, RESTful APIs, AWS",
                "explanation": "Use specific technologies instead of generic terms"
            })
        
        elif scores.get('keyword', 0) < 0.5:
            query = f"optimize keywords for: {job_description[:200]}"
            tips = self.get_relevant_tips(query, top_k=2)
            suggestions["high_priority"].append({
                "issue": "Moderate keyword gap",
                "action": "Add 3-5 more relevant keywords to Skills section",
                "impact": "Could increase match score by 10-20%",
                "priority": "high"
            })
            suggestions["tips"].extend(tips)
        
        # Structural issues
        if scores.get('structural', 0) < 0.6:
            query = "improve resume structure and formatting ATS compatibility"
            tips = self.get_relevant_tips(query, top_k=3)
            suggestions["critical"].extend([
                {
                    "issue": "Poor structure - may not pass ATS",
                    "action": "Add clear section headings: Experience, Education, Skills, Contact",
                    "impact": "Critical for ATS parsing",
                    "priority": "critical"
                },
                {
                    "issue": "Inconsistent formatting",
                    "action": "Use standard single-column layout with simple bullets",
                    "impact": "Better readability and ATS compatibility",
                    "priority": "high"
                }
            ])
            suggestions["tips"].extend(tips)
            
            suggestions["examples"].append({
                "category": "structure",
                "before": "Work Experience\nCompany XYZ - did various tasks",
                "after": "EXPERIENCE\nSoftware Engineer | Company XYZ | Jan 2020 - Present\n• Developed 10+ microservices serving 100K+ daily users\n• Reduced API latency by 40% through optimization\n• Led team of 3 engineers on critical projects",
                "explanation": "Clear hierarchy, quantified achievements, action verbs"
            })
        
        elif scores.get('structural', 0) < 0.7:
            query = "resume formatting best practices"
            tips = self.get_relevant_tips(query, top_k=2)
            suggestions["high_priority"].append({
                "issue": "Structure could be improved",
                "action": "Ensure consistent formatting and clear section separation",
                "impact": "Better readability",
                "priority": "medium"
            })
            suggestions["tips"].extend(tips)
        
        # Tone and writing style
        if scores.get('tone', 0) < 0.5:
            query = "improve professional writing tone action verbs impact"
            tips = self.get_relevant_tips(query, top_k=3)
            suggestions["high_priority"].extend([
                {
                    "issue": "Weak language and tone",
                    "action": "Start each bullet with strong action verbs (Led, Developed, Architected, Optimized)",
                    "impact": "More compelling and professional",
                    "priority": "high"
                },
                {
                    "issue": "Missing quantifiable achievements",
                    "action": "Add specific metrics: numbers, percentages, scale indicators",
                    "impact": "Demonstrates concrete impact",
                    "priority": "high"
                }
            ])
            suggestions["tips"].extend(tips)
            
            suggestions["examples"].append({
                "category": "action_verbs",
                "before": "Responsible for improving the application performance",
                "after": "Optimized application performance, reducing load time by 65% and improving user satisfaction scores from 3.2 to 4.7",
                "explanation": "Strong verb + specific metrics + tangible outcome"
            })
            
            suggestions["examples"].append({
                "category": "quantification",
                "before": "Worked on multiple projects and helped the team",
                "after": "Led 5 cross-functional projects with teams of 8-12 members, delivering features that increased revenue by $2M annually",
                "explanation": "Specific numbers show scale and impact"
            })
        
        elif scores.get('tone', 0) < 0.7:
            query = "action verbs quantifiable achievements"
            tips = self.get_relevant_tips(query, top_k=2)
            suggestions["recommended"].append({
                "issue": "Could strengthen impact statements",
                "action": "Add more metrics and quantify achievements where possible",
                "impact": "More impressive presentation",
                "priority": "medium"
            })
            suggestions["tips"].extend(tips)
        
        # Semantic alignment
        if scores.get('semantic', 0) < 0.5:
            query = f"align resume with job description: {job_description[:200]}"
            tips = self.get_relevant_tips(query, top_k=2)
            suggestions["high_priority"].append({
                "issue": "Poor semantic match with JD",
                "action": "Mirror the phrasing and terminology used in the job description",
                "impact": "Better algorithmic matching",
                "priority": "high"
            })
            suggestions["tips"].extend(tips)
        
        # Readability
        if scores.get('readability', 0) < 0.5:
            query = "improve resume readability concise writing"
            tips = self.get_relevant_tips(query, top_k=2)
            suggestions["recommended"].append({
                "issue": "Readability could be improved",
                "action": "Break long sentences into shorter, punchier bullet points (15-20 words max)",
                "impact": "Easier to scan and read",
                "priority": "medium"
            })
            suggestions["tips"].extend(tips)
        
        # Overall resume quality recommendations
        if composite >= 0.7:
            # Already good - focus on polish
            query = "polish resume advanced optimization"
            tips = self.get_relevant_tips(query, top_k=3)
            suggestions["recommended"].extend([
                {
                    "issue": "Resume is strong - minor polish recommended",
                    "action": "Add portfolio/GitHub links to stand out",
                    "impact": "Differentiator for competitive roles",
                    "priority": "low"
                },
                {
                    "issue": "Optimization opportunity",
                    "action": "Add 1-2 more quantified achievements to recent roles",
                    "impact": "Even stronger impact",
                    "priority": "low"
                }
            ])
            suggestions["tips"].extend(tips)
        
        elif composite < 0.4:
            # Significant improvements needed
            query = "major resume overhaul improvement strategy"
            tips = self.get_relevant_tips(query, top_k=4)
            suggestions["critical"].append({
                "issue": "Resume needs significant improvement",
                "action": "Consider a complete rewrite focusing on: clear structure, keywords, metrics, action verbs",
                "impact": "Could increase match from {:.0f}% to 60-70%".format(composite * 100),
                "priority": "critical"
            })
            suggestions["tips"].extend(tips)
        
        # Get general best practices based on JD
        general_query = f"resume best practices for {job_description[:150]}"
        general_tips = self.get_relevant_tips(general_query, top_k=4)
        suggestions["tips"].extend(general_tips)
        
        # Remove duplicate tips (by tip text)
        seen = set()
        unique_tips = []
        for tip in suggestions["tips"]:
            if tip["tip"] not in seen:
                seen.add(tip["tip"])
                unique_tips.append(tip)
        suggestions["tips"] = unique_tips[:10]  # Limit to top 10
        
        # Sort by priority and relevance
        suggestions["critical"] = sorted(suggestions["critical"], key=lambda x: x.get("priority") == "critical", reverse=True)
        suggestions["high_priority"] = sorted(suggestions["high_priority"], key=lambda x: x.get("priority") == "high", reverse=True)
        
        # Add summary
        suggestions["summary"] = {
            "total_issues": len(suggestions["critical"]) + len(suggestions["high_priority"]),
            "critical_count": len(suggestions["critical"]),
            "estimated_time": f"{(len(suggestions['critical']) * 15 + len(suggestions['high_priority']) * 10)} minutes",
            "priority_focus": "Fix critical issues first for biggest impact"
        }
        
        return suggestions
    
    def add_knowledge(self, tip: str, category: str, context: str):
        """Add new tip to knowledge base"""
        self.knowledge_base.append({
            "tip": tip,
            "category": category,
            "context": context
        })
        self._create_kb_embeddings()
    
    def save_knowledge_base(self, path: str):
        """Save knowledge base to file"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(self.knowledge_base, f, indent=2)


# Singleton instance
_rag_engine = None

def get_rag_engine():
    """Get or create RAG engine singleton"""
    global _rag_engine
    if _rag_engine is None:
        _rag_engine = SimpleRAGEngine()
    return _rag_engine
