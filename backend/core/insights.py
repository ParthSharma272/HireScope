# backend/core/insights.py
"""
Advanced AI-Powered Insights and Suggestions Engine for HireScope
Provides comprehensive, actionable recommendations for resume improvement
"""
import re
from typing import Dict, List, Optional, Tuple
from collections import Counter


def generate_insight(resume_text: str, jd_text: str, scores: dict):
    """
    Enhanced insight generator with comprehensive analysis.
    Returns detailed, actionable recommendations.
    """
    comp = scores.get("composite", 0.0)
    role = scores.get("role", "GENERAL")
    
    # Determine overall strength
    if comp > 0.75:
        strength = "🎯 Strong match overall. Your resume is well-structured and relevant."
        emoji = "✅"
    elif comp > 0.5:
        strength = "📊 Moderate fit. A few targeted improvements will significantly increase match."
        emoji = "⚠️"
    else:
        strength = "🔧 Needs improvement. Focus on key areas below to boost your match rate."
        emoji = "❗"
    
    # Generate primary suggestions
    suggestions = []
    if scores.get("keyword", 0) < 0.5:
        suggestions.append("Include more role-specific keywords from the job description (technologies, tools).")
    if scores.get("semantic", 0) < 0.5:
        suggestions.append("Make project outcomes more explicit and align phrasing to the job description.")
    if scores.get("structural", 0) < 0.66:
        suggestions.append("Add or restructure Experience/Education/Skills sections clearly.")
    if scores.get("tone", 0) < 0.4:
        suggestions.append("Use more action verbs and quantify impact (numbers, % growth, scale).")
    
    if not suggestions:
        suggestions = ["Resume looks well-aligned — consider adding metrics to projects to increase impact."]
    
    # Create concise insight
    insight = f"{strength} Recommendation: {suggestions[0]}"
    return insight


def analyze_ats_compatibility(resume_text: str) -> Dict:
    """
    Analyze ATS (Applicant Tracking System) compatibility.
    Checks formatting, structure, and parsability.
    """
    text_lower = resume_text.lower()
    issues = []
    recommendations = []
    ats_score = 100  # Start with perfect score
    
    # Check for common ATS-unfriendly elements
    if any(char in resume_text for char in ['►', '●', '■', '◆', '★']):
        issues.append("Contains special bullet characters that may not parse correctly")
        recommendations.append("Use simple bullets (-) or asterisks (*)")
        ats_score -= 10
    
    # Check for tables/columns (heuristic)
    if resume_text.count('|') > 5 or resume_text.count('\t') > 10:
        issues.append("May contain tables or complex formatting")
        recommendations.append("Use simple, single-column layout for better ATS parsing")
        ats_score -= 15
    
    # Check for headers and footers (heuristic: repeated text)
    lines = [l.strip() for l in resume_text.split('\n') if l.strip()]
    if len(lines) > 10:
        line_counter = Counter(lines)
        repeated = [line for line, count in line_counter.items() if count > 2 and len(line) > 10]
        if repeated:
            issues.append("Potential headers/footers detected")
            recommendations.append("Remove headers/footers as ATS may not parse them correctly")
            ats_score -= 5
    
    # Check for images (cannot directly detect, but check for common indicators)
    if 'image' in text_lower or 'photo' in text_lower or 'picture' in text_lower:
        issues.append("Possible image references")
        recommendations.append("Avoid images and photos in ATS-submitted resumes")
        ats_score -= 10
    
    # Check for essential sections
    has_experience = any(keyword in text_lower for keyword in ['experience', 'work history', 'employment', 'professional background'])
    has_education = any(keyword in text_lower for keyword in ['education', 'degree', 'university', 'college', 'bachelor', 'master'])
    has_skills = any(keyword in text_lower for keyword in ['skills', 'competencies', 'technologies', 'technical skills'])
    has_contact = '@' in resume_text or 'email' in text_lower or 'phone' in text_lower
    
    if not has_experience:
        issues.append("Experience section not clearly labeled")
        recommendations.append("Add clear 'Experience' or 'Work History' section heading")
        ats_score -= 15
    
    if not has_education:
        issues.append("Education section not clearly labeled")
        recommendations.append("Add clear 'Education' section heading")
        ats_score -= 10
    
    if not has_skills:
        issues.append("Skills section not clearly labeled")
        recommendations.append("Add dedicated 'Skills' or 'Technical Skills' section")
        ats_score -= 10
    
    if not has_contact:
        issues.append("Contact information may be missing or unclear")
        recommendations.append("Ensure email and phone are clearly visible at top")
        ats_score -= 5
    
    # Check keyword density (should have reasonable amount)
    words = resume_text.split()
    if len(words) < 200:
        issues.append("Resume appears too short (less than 200 words)")
        recommendations.append("Expand with more details and achievements")
        ats_score -= 15
    elif len(words) > 1000:
        issues.append("Resume may be too lengthy (over 1000 words)")
        recommendations.append("Condense to 1-2 pages for better ATS processing")
        ats_score -= 5
    
    # Check for file-related issues (PDF vs DOCX)
    # Note: This is at parse time, so just general advice
    recommendations.append("Submit as .docx if possible, or clean PDF with selectable text")
    
    ats_score = max(0, min(100, ats_score))
    
    return {
        "ats_score": ats_score,
        "grade": "Excellent" if ats_score >= 85 else "Good" if ats_score >= 70 else "Fair" if ats_score >= 50 else "Needs Work",
        "issues": issues,
        "recommendations": recommendations,
        "passed_basic_checks": has_experience and has_education and has_contact
    }


def detect_missing_keywords(resume_text: str, jd_text: str, matched_keywords: List[str]) -> Dict:
    """
    Identify critical keywords from JD that are missing in resume.
    """
    if not jd_text:
        return {"critical_missing": [], "suggested_additions": []}
    
    # Common technical keywords and skills
    from core.keyword_match import TECHNICAL_KEYWORDS
    
    jd_lower = jd_text.lower()
    resume_lower = resume_text.lower()
    matched_lower = [k.lower() for k in matched_keywords]
    
    # Find keywords in JD that are in our database but missing from resume
    missing = []
    for keyword in TECHNICAL_KEYWORDS:
        kw_lower = keyword.lower()
        if kw_lower in jd_lower and kw_lower not in resume_lower:
            missing.append(keyword)
    
    # Prioritize by frequency in JD
    keyword_freq = {}
    for kw in missing[:30]:  # Limit to top candidates
        kw_lower = kw.lower()
        count = jd_lower.count(kw_lower)
        if count > 0:
            keyword_freq[kw] = count
    
    # Sort by frequency
    critical_missing = sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)[:10]
    critical_missing = [kw for kw, freq in critical_missing]
    
    # Generate suggestions
    suggested_additions = []
    for kw in critical_missing[:5]:
        suggested_additions.append({
            "keyword": kw,
            "suggestion": f"Add '{kw}' to your Skills section or mention in relevant project/experience",
            "priority": "high" if keyword_freq.get(kw, 0) > 2 else "medium"
        })
    
    return {
        "critical_missing": critical_missing,
        "suggested_additions": suggested_additions,
        "total_missing": len(missing)
    }


def generate_section_recommendations(resume_text: str, scores: dict, role: str) -> Dict:
    """
    Generate specific recommendations for each resume section.
    """
    recommendations = {
        "experience": [],
        "skills": [],
        "education": [],
        "summary": [],
        "formatting": []
    }
    
    text_lower = resume_text.lower()
    
    # Experience section analysis
    action_verbs = ['led', 'developed', 'built', 'designed', 'implemented', 'created', 'managed', 'optimized', 'deployed', 'improved', 'increased', 'reduced']
    verb_count = sum(resume_text.lower().count(v) for v in action_verbs)
    sentences = len([s for s in resume_text.split('.') if s.strip()])
    verb_ratio = verb_count / max(1, sentences)
    
    if verb_ratio < 0.3:
        recommendations["experience"].append({
            "issue": "Low action verb usage",
            "suggestion": "Start each bullet point with strong action verbs like 'Led', 'Developed', 'Implemented'",
            "example": "❌ Was responsible for developing features\n✅ Developed 5+ key features that increased user engagement by 40%"
        })
    
    # Check for metrics/numbers
    numbers = re.findall(r'\d+[%$]?|\d+\+', resume_text)
    if len(numbers) < 5:
        recommendations["experience"].append({
            "issue": "Insufficient quantifiable achievements",
            "suggestion": "Add specific metrics and numbers to demonstrate impact",
            "example": "❌ Improved system performance\n✅ Optimized database queries, reducing load time by 65% and serving 10K+ users"
        })
    
    # Skills section analysis
    has_skills_section = 'skills' in text_lower or 'technologies' in text_lower
    if not has_skills_section:
        recommendations["skills"].append({
            "issue": "No dedicated skills section",
            "suggestion": "Create a clear 'Technical Skills' or 'Core Competencies' section",
            "example": "**Technical Skills**\n• Languages: Python, JavaScript, SQL\n• Frameworks: React, FastAPI, Node.js\n• Tools: Docker, Git, AWS"
        })
    
    # Role-specific recommendations
    if role == "TECH":
        if 'github' not in text_lower and 'portfolio' not in text_lower:
            recommendations["experience"].append({
                "issue": "No portfolio/GitHub link",
                "suggestion": "Add links to GitHub, portfolio, or project demos for technical roles",
                "example": "GitHub: github.com/yourname | Portfolio: yourportfolio.com"
            })
    
    # Summary/objective analysis
    has_summary = any(keyword in text_lower for keyword in ['summary', 'objective', 'about', 'profile'])
    if not has_summary and len(resume_text) > 500:
        recommendations["summary"].append({
            "issue": "Missing professional summary",
            "suggestion": "Add a 2-3 line summary at the top highlighting your key strengths",
            "example": "Senior Software Engineer with 5+ years building scalable web applications. Expert in Python, React, and AWS. Led teams of 5+ engineers to deliver products serving 1M+ users."
        })
    
    return recommendations


def calculate_competitive_score(scores: dict, skill_levels: Dict) -> Dict:
    """
    Estimate how resume compares to typical candidates.
    """
    composite = scores.get("composite", 0.0)
    
    # Benchmark data (industry averages for different score ranges)
    if composite >= 0.75:
        percentile = 90
        comparison = "Top 10% of candidates"
        competitiveness = "Highly Competitive"
    elif composite >= 0.60:
        percentile = 75
        comparison = "Top 25% of candidates"
        competitiveness = "Competitive"
    elif composite >= 0.45:
        percentile = 50
        comparison = "Average candidate pool"
        competitiveness = "Moderately Competitive"
    else:
        percentile = 25
        comparison = "Below average match"
        competitiveness = "Needs Improvement"
    
    # Skill level analysis
    expert_skills = sum(1 for s in skill_levels.values() if s.level == 'expert')
    advanced_skills = sum(1 for s in skill_levels.values() if s.level == 'advanced')
    
    skill_strength = "Strong" if expert_skills >= 3 else "Moderate" if advanced_skills >= 3 else "Developing"
    
    # Generate comprehensive message
    if percentile >= 90:
        message = f"Excellent! You're in the {comparison.lower()}. Your resume demonstrates strong alignment with the role requirements."
    elif percentile >= 75:
        message = f"Good standing - you're in the {comparison.lower()}. With a few key improvements, you could reach the top 10%."
    elif percentile >= 50:
        message = f"You're {comparison.lower()}. Focus on critical improvements to stand out from other applicants."
    else:
        message = f"Your resume is {comparison.lower()}. Significant improvements needed to be competitive for this role."
    
    return {
        "percentile": percentile,
        "comparison": comparison,
        "competitiveness": competitiveness,
        "skill_strength": skill_strength,
        "expert_skills_count": expert_skills,
        "advanced_skills_count": advanced_skills,
        "message": message
    }


def generate_advanced_suggestions(
    resume_text: str,
    jd_text: str,
    scores: dict,
    keyword_stats: dict,
    skill_levels: Dict,
    weighted_match: Dict
) -> Dict:
    """
    Master function: Generate comprehensive AI-powered suggestions.
    Combines all analysis modules into actionable recommendations.
    """
    
    role = scores.get("role", "GENERAL")
    composite = scores.get("composite", 0.0)
    
    # 1. ATS Compatibility Analysis
    ats_analysis = analyze_ats_compatibility(resume_text)
    
    # 2. Missing Keywords Analysis
    matched_keywords = keyword_stats.get("matches", [])
    gap_analysis = detect_missing_keywords(resume_text, jd_text, matched_keywords)
    
    # 3. Section-Specific Recommendations
    section_recs = generate_section_recommendations(resume_text, scores, role)
    
    # 4. Competitive Intelligence
    competitive = calculate_competitive_score(scores, skill_levels)
    
    # 5. Prioritized Action Items
    action_items = {
        "critical": [],  # Must fix (score boosters)
        "high_priority": [],  # Strong impact
        "medium_priority": [],  # Good to have
        "optional": []  # Nice to have
    }
    
    # Critical items (biggest score impact)
    if scores.get("keyword", 0) < 0.4:
        action_items["critical"].append({
            "title": "Add Critical Missing Keywords",
            "description": f"Your keyword match is only {scores.get('keyword', 0)*100:.0f}%. Add these high-priority keywords: {', '.join(gap_analysis['critical_missing'][:5])}",
            "impact": "🔥 High Impact - Could increase match by 20-30%",
            "effort": "Medium"
        })
    
    if scores.get("structural", 0) < 0.6:
        action_items["critical"].append({
            "title": "Fix Resume Structure",
            "description": "Ensure clear section headings: Experience, Education, Skills, Contact",
            "impact": "🔥 High Impact - Better ATS parsing",
            "effort": "Low"
        })
    
    if ats_analysis["ats_score"] < 70:
        action_items["critical"].append({
            "title": "Improve ATS Compatibility",
            "description": f"ATS score is {ats_analysis['ats_score']}/100. Issues: {', '.join(ats_analysis['issues'][:3])}",
            "impact": "🔥 High Impact - May not pass ATS screening",
            "effort": "Low"
        })
    
    # High priority items
    if scores.get("tone", 0) < 0.5:
        action_items["high_priority"].append({
            "title": "Strengthen Language & Tone",
            "description": "Use more action verbs and quantify achievements with numbers",
            "impact": "📈 Medium-High Impact - More compelling resume",
            "effort": "Medium"
        })
    
    if scores.get("semantic", 0) < 0.5:
        action_items["high_priority"].append({
            "title": "Align with Job Description Phrasing",
            "description": "Mirror the language and terminology used in the job description",
            "impact": "📈 Medium-High Impact - Better semantic match",
            "effort": "Medium"
        })
    
    # Add skill-specific recommendations
    beginner_skills = [s for s in skill_levels.values() if s.level == 'beginner']
    if len(beginner_skills) > 3:
        action_items["high_priority"].append({
            "title": "Demonstrate Skill Proficiency",
            "description": f"You have {len(beginner_skills)} skills marked as 'beginner'. Add projects or experience showing deeper expertise",
            "impact": "📈 Medium Impact - Shows stronger capabilities",
            "effort": "High"
        })
    
    # Medium priority
    if len(section_recs["experience"]) > 0:
        action_items["medium_priority"].append({
            "title": "Enhance Experience Section",
            "description": section_recs["experience"][0]["suggestion"],
            "impact": "📊 Medium Impact - More professional presentation",
            "effort": "Medium",
            "example": section_recs["experience"][0].get("example", "")
        })
    
    # Optional improvements
    if composite > 0.6:
        action_items["optional"].append({
            "title": "Add Portfolio/GitHub Links",
            "description": "Include links to projects, GitHub, or portfolio to stand out",
            "impact": "💡 Low-Medium Impact - Differentiator for top candidates",
            "effort": "Low"
        })
    
    # 6. Quick Wins (easy, high-impact changes)
    quick_wins = []
    if len(gap_analysis["critical_missing"]) > 0:
        quick_wins.append(f"Add these 3 keywords to Skills: {', '.join(gap_analysis['critical_missing'][:3])}")
    
    if scores.get("structural", 0) < 0.7:
        quick_wins.append("Add clear section headings if missing")
    
    if ats_analysis["ats_score"] < 85 and len(ats_analysis["recommendations"]) > 0:
        quick_wins.append(ats_analysis["recommendations"][0])
    
    # 7. Overall Summary
    total_critical = len(action_items["critical"])
    total_high_priority = len(action_items["high_priority"])
    total_actions = total_critical + total_high_priority
    
    grade = "A" if composite >= 0.75 else "B" if composite >= 0.60 else "C" if composite >= 0.45 else "D"
    
    # Grade-specific emoji and message
    grade_info = {
        "A": {
            "emoji": "🌟",
            "message": "Excellent resume! Your resume is highly competitive and well-aligned with the role."
        },
        "B": {
            "emoji": "👍",
            "message": "Good resume with solid fundamentals. A few targeted improvements will make it excellent."
        },
        "C": {
            "emoji": "📈",
            "message": "Decent resume but needs improvement. Focus on critical issues to significantly boost your chances."
        },
        "D": {
            "emoji": "⚠️",
            "message": "Resume needs significant work. Prioritize critical fixes to make it competitive."
        }
    }
    
    summary = {
        "overall_grade": grade,
        "emoji": grade_info[grade]["emoji"],
        "message": grade_info[grade]["message"],
        "critical_count": total_critical,
        "high_priority_count": total_high_priority,
        "estimated_time": f"{total_actions * 15}-{total_actions * 30} minutes" if total_actions > 0 else "0 minutes",
        "strengths": [],
        "weaknesses": []
    }
    
    # Identify strengths
    if scores.get("keyword", 0) >= 0.6:
        summary["strengths"].append("Strong keyword coverage")
    if scores.get("structural", 0) >= 0.7:
        summary["strengths"].append("Well-structured format")
    if scores.get("tone", 0) >= 0.6:
        summary["strengths"].append("Professional tone and language")
    if competitive["expert_skills_count"] >= 2:
        summary["strengths"].append(f"Expert in {competitive['expert_skills_count']} key skills")
    
    # Identify weaknesses
    if scores.get("keyword", 0) < 0.5:
        summary["weaknesses"].append("Missing critical keywords")
    if scores.get("semantic", 0) < 0.5:
        summary["weaknesses"].append("Poor semantic alignment with JD")
    if ats_analysis["ats_score"] < 70:
        summary["weaknesses"].append("Low ATS compatibility")
    
    return {
        "version": "2.0",
        "timestamp": "Generated by HireScope AI",
        "summary": summary,
        "competitive_analysis": competitive,
        "ats_compatibility": ats_analysis,
        "gap_analysis": gap_analysis,
        "action_items": action_items,
        "quick_wins": quick_wins,
        "section_recommendations": section_recs,
        "match_breakdown": {
            "keyword_score": f"{scores.get('keyword', 0)*100:.1f}%",
            "semantic_score": f"{scores.get('semantic', 0)*100:.1f}%",
            "structural_score": f"{scores.get('structural', 0)*100:.1f}%",
            "tone_score": f"{scores.get('tone', 0)*100:.1f}%",
            "composite_score": f"{composite*100:.1f}%"
        }
    }
