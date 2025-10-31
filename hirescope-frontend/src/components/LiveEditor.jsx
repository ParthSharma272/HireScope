import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  DocumentTextIcon,
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function LiveEditor({ initialResume = "", jobDescription = "", onBack }) {
  const [resumeText, setResumeText] = useState(initialResume);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveScore, setLiveScore] = useState(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState("");
  const debounceTimer = useRef(null);

  // Debounced analysis function
  const analyzeResume = useCallback(async (text) => {
    if (!text.trim() || text === lastAnalyzedText) return;
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("resume_text", text);
      formData.append("job_description", jobDescription || "");
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/live/live-analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );
      
      setLiveScore(response.data);
      setLastAnalyzedText(text);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription, lastAnalyzedText]);

  // Handle text changes with debouncing
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setResumeText(newText);
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for 2 seconds of inactivity
    debounceTimer.current = setTimeout(() => {
      analyzeResume(newText);
    }, 2000);
  };

  // Initial analysis
  useEffect(() => {
    if (initialResume) {
      analyzeResume(initialResume);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const overallScore = liveScore?.scores?.composite 
    ? Math.round(liveScore.scores.composite * 100) 
    : 0;

  const scoreData = [{
    name: "Score",
    value: overallScore,
    fill: overallScore >= 80 ? "#10b981" : overallScore >= 60 ? "#f59e0b" : "#ef4444",
  }];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="glass-effect border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Back to Home"
              >
                <HomeIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </button>
            )}
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Live Resume Editor</h1>
              <p className="text-sm text-gray-600">Type to see instant ATS scoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg"
              >
                <ArrowPathIcon className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-600">Analyzing...</span>
              </motion.div>
            )}
            
            <div className="text-sm text-gray-600">
              Words: <span className="font-semibold text-gray-900">
                {resumeText.trim().split(/\s+/).filter(w => w).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-200">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Resume Content</h2>
              <button
                onClick={() => analyzeResume(resumeText)}
                className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
              >
                Analyze Now
              </button>
            </div>
          </div>
          
          <textarea
            value={resumeText}
            onChange={handleTextChange}
            placeholder="Paste your resume here or start typing...

Example:
JOHN DOE
Software Engineer | john@email.com

EXPERIENCE
Senior Engineer at Tech Corp (2020-2024)
• Led development of ML pipeline using Python and TensorFlow
• Deployed microservices on AWS with Docker and Kubernetes
• Improved system performance by 40%

SKILLS
Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes"
            className="flex-1 w-full px-6 py-4 font-mono text-sm text-gray-800 resize-none focus:outline-none focus:ring-0 border-0 leading-relaxed"
            style={{ 
              tabSize: 2,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
            }}
          />
          
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            💡 Tip: Changes auto-analyze after 2 seconds of inactivity
          </div>
        </div>

        {/* Right: Live Scores */}
        <div className="w-[480px] flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30 overflow-y-auto">
          <div className="px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-700">Live Scoring</h2>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6">
            <AnimatePresence mode="wait">
              {!liveScore ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <DocumentTextIcon className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Typing
                  </h3>
                  <p className="text-sm text-gray-600 max-w-xs">
                    Your resume will be analyzed in real-time as you type. 
                    Scores will appear here instantly!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="scores"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Overall Score */}
                  <div className="glass-effect rounded-2xl p-6 shadow-card">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="100%"
                            barSize={12}
                            data={scoreData}
                            startAngle={90}
                            endAngle={-270}
                          >
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                            <RadialBar
                              background
                              dataKey="value"
                              cornerRadius={10}
                              fill={scoreData[0].fill}
                            />
                            <text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-2xl font-bold"
                              fill="#1f2937"
                            >
                              {overallScore}%
                            </text>
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="flex-1">
                        <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                          {getScoreLabel(overallScore)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Overall ATS Match Score
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Structure", score: liveScore.scores.structural, icon: "📋" },
                      { label: "Keywords", score: liveScore.scores.keyword, icon: "🔑" },
                      { label: "Relevance", score: liveScore.scores.semantic, icon: "🎯" },
                      { label: "Readability", score: liveScore.scores.readability, icon: "📖" },
                    ].map((metric) => (
                      <motion.div
                        key={metric.label}
                        layout
                        className="glass-effect rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{metric.icon}</span>
                          <span className="text-xs font-medium text-gray-600">{metric.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.round((metric.score || 0) * 100)}%
                        </div>
                        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(metric.score || 0) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Keywords */}
                  {liveScore.keywords && (
                    <div className="glass-effect rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Keywords Found ({liveScore.keywords.matched}/{liveScore.keywords.required})
                      </h3>
                      
                      <div className="space-y-3">
                        {liveScore.keywords.matches?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <CheckCircleIcon className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-gray-600">Matched</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {liveScore.keywords.matches.slice(0, 10).map((kw) => (
                                <motion.span
                                  key={kw}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                                >
                                  {kw}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {liveScore.keywords.missing?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <XCircleIcon className="w-4 h-4 text-red-600" />
                              <span className="text-xs font-medium text-gray-600">Missing</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {liveScore.keywords.missing.slice(0, 8).map((kw) => (
                                <motion.span
                                  key={kw}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium"
                                >
                                  {kw}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Insight */}
                  {liveScore.ai_suggestions_summary && (
                    <div className="glass-effect rounded-xl p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-purple-600" />
                        AI Quick Feedback
                      </h3>
                      
                      {/* Grade and Stats */}
                      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
                        <div>
                          <div className="text-xs text-gray-600">Overall Grade</div>
                          <div className="text-2xl font-bold text-purple-600">
                            {liveScore.ai_suggestions_summary.overall_grade}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Critical Issues</div>
                          <div className="text-xl font-bold text-red-600">
                            {liveScore.ai_suggestions_summary.critical_count}
                          </div>
                        </div>
                      </div>

                      {/* Quick Wins */}
                      {liveScore.ai_suggestions_summary.quick_wins && 
                       liveScore.ai_suggestions_summary.quick_wins.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-green-600 mb-2">⚡ Quick Wins:</div>
                          <ul className="space-y-1">
                            {liveScore.ai_suggestions_summary.quick_wins.map((win, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>{win}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {liveScore.ai_suggestions_summary.estimated_time && (
                        <div className="text-xs text-gray-500 italic border-t pt-2 mt-2">
                          ⏱️ Estimated time to improve: {liveScore.ai_suggestions_summary.estimated_time}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback to basic insight if new suggestions not available */}
                  {!liveScore.ai_suggestions_summary && liveScore.insight && (
                    <div className="glass-effect rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-purple-600" />
                        AI Insight
                      </h3>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {liveScore.insight}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
