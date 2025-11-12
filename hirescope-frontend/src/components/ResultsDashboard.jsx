import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function ResultsDashboard({ result }) {
  // Backend returns 'composite' as the overall score (0-1 range)
  const overallScore = Math.round(
    (result.scores?.composite || 0) * 100
  );

  const scoreData = [
    {
      name: "Score",
      value: overallScore,
      fill: overallScore >= 80 ? "#10b981" : overallScore >= 60 ? "#f59e0b" : "#ef4444",
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Analysis Complete
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Here's how your resume matches the job description
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6 md:p-8 shadow-card"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-40 h-40 md:w-48 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={20}
                  data={scoreData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
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
                    className="text-4xl font-bold"
                    fill="#1f2937"
                  >
                    {overallScore}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Overall Match Score
              </h3>
              <p className={`text-lg md:text-xl font-semibold mb-4 ${getScoreColor(overallScore)}`}>
                {getScoreLabel(overallScore)}
              </p>
              <p className="text-sm md:text-base text-gray-600 max-w-xl">
                Your resume has been analyzed against the job description. The
                score reflects keyword relevance, skills alignment, and content
                quality.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        {result.scores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Primary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  label: "Structural Quality",
                  score: result.scores.structural,
                  icon: ChartBarIcon,
                  description: "Resume format and sections"
                },
                {
                  label: "Keyword Match",
                  score: result.scores.keyword,
                  icon: CheckCircleIcon,
                  description: "Job description alignment"
                },
                {
                  label: "Semantic Relevance",
                  score: result.scores.semantic,
                  icon: LightBulbIcon,
                  description: "Contextual similarity"
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="glass-effect rounded-xl p-4 md:p-6 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <item.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {Math.round((item.score || 0) * 100)}
                    </span>
                    <span className="text-gray-500">/ 100</span>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.score || 0) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  label: "Readability",
                  score: result.scores.readability,
                  description: "Clarity and comprehension",
                  color: "blue"
                },
                {
                  label: "Tone & Impact",
                  score: result.scores.tone,
                  description: "Action verbs and engagement",
                  color: "purple"
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="glass-effect rounded-xl p-4 md:p-6 shadow-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {Math.round((item.score || 0) * 100)}
                      </span>
                      <span className="text-gray-500 text-sm">/100</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.score || 0) * 100}%` }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                      className={`h-full ${
                        item.color === "blue"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Role Detection Badge */}
            {result.scores.role && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">
                    Detected Role: <span className="text-indigo-600">{result.scores.role}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Keyword Analysis */}
        {result.keywords && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-8 shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Keyword Analysis
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Matched Keywords */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">
                    Matched Keywords ({result.keywords.matches?.length || 0})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.matches?.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                  {(!result.keywords.matches || result.keywords.matches.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No matched keywords found</p>
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-gray-900">
                    Missing Keywords ({result.keywords.missing?.length || 0})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.missing?.slice(0, 10).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                  {result.keywords.missing?.length > 10 && (
                    <span className="px-3 py-1 text-gray-600 text-sm italic">
                      +{result.keywords.missing.length - 10} more
                    </span>
                  )}
                  {(!result.keywords.missing || result.keywords.missing.length === 0) && (
                    <p className="text-sm text-gray-500 italic">All keywords matched!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Keyword Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{result.keywords.required || 0}</p>
                  <p className="text-sm text-gray-600">Required Keywords</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{result.keywords.matched || 0}</p>
                  <p className="text-sm text-gray-600">Matched</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {result.keywords.required > 0 
                      ? Math.round((result.keywords.matched / result.keywords.required) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Match Rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Suggestions - Comprehensive v2.0 */}
        {result.ai_suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-2xl p-8 shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LightBulbIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                AI-Powered Insights & Recommendations
              </h3>
            </div>

            {/* Summary Card */}
            {result.ai_suggestions.summary && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{result.ai_suggestions.summary.emoji || '📊'}</span>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900">
                      Overall Grade: {result.ai_suggestions.summary.overall_grade || 'N/A'}
                    </h4>
                    <p className="text-gray-600">{result.ai_suggestions.summary.message || 'Analysis complete'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600">
                      {result.ai_suggestions.summary.critical_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">Critical Issues</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600">
                      {result.ai_suggestions.summary.high_priority_count || 0}
                    </div>
                    <div className="text-sm text-gray-600">High Priority</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-lg font-semibold text-blue-600">
                      {result.ai_suggestions.summary.estimated_time || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Est. Time</div>
                  </div>
                </div>
              </div>
            )}

            {/* ATS Compatibility */}
            {result.ai_suggestions.ats_compatibility && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">🤖 ATS Compatibility</h4>
                <div className="bg-white rounded-lg p-4 border-2 border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 font-semibold">ATS Score</span>
                    <span className={`text-2xl font-bold ${
                      result.ai_suggestions.ats_compatibility.ats_score >= 80 ? 'text-green-600' :
                      result.ai_suggestions.ats_compatibility.ats_score >= 60 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {result.ai_suggestions.ats_compatibility.ats_score}/100
                    </span>
                  </div>
                  {result.ai_suggestions.ats_compatibility.issues && result.ai_suggestions.ats_compatibility.issues.length > 0 && (
                    <ul className="space-y-2 mt-3">
                      {result.ai_suggestions.ats_compatibility.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-red-500 mt-0.5">⚠️</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}            {/* Quick Wins */}
            {result.ai_suggestions.quick_wins && result.ai_suggestions.quick_wins.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">⚡ Quick Wins (Easy High-Impact Changes)</h4>
                <div className="space-y-2">
                  {result.ai_suggestions.quick_wins.map((win, idx) => (
                    <div key={idx} className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="text-gray-800 font-medium">{win}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prioritized Action Items */}
            {result.ai_suggestions.action_items && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">📋 Action Items</h4>
                
                {/* Critical */}
                {result.ai_suggestions.action_items.critical && result.ai_suggestions.action_items.critical.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-md font-semibold text-red-600 mb-2">🚨 Critical (Fix Immediately)</h5>
                    <ul className="space-y-2">
                      {result.ai_suggestions.action_items.critical.map((item, idx) => (
                        <li key={idx} className="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
                          {typeof item === 'string' ? (
                            <p className="text-sm text-gray-800">{item}</p>
                          ) : (
                            <div>
                              <h6 className="font-semibold text-gray-900 mb-1">{item.title}</h6>
                              <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-red-600 font-medium">{item.impact}</span>
                                <span className="text-gray-500">Effort: {item.effort}</span>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* High Priority */}
                {result.ai_suggestions.action_items.high_priority && result.ai_suggestions.action_items.high_priority.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-md font-semibold text-orange-600 mb-2">⚠️ High Priority</h5>
                    <ul className="space-y-2">
                      {result.ai_suggestions.action_items.high_priority.map((item, idx) => (
                        <li key={idx} className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
                          {typeof item === 'string' ? (
                            <p className="text-sm text-gray-800">{item}</p>
                          ) : (
                            <div>
                              <h6 className="font-semibold text-gray-900 mb-1">{item.title}</h6>
                              <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-orange-600 font-medium">{item.impact}</span>
                                <span className="text-gray-500">Effort: {item.effort}</span>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Medium Priority */}
                {result.ai_suggestions.action_items.medium_priority && result.ai_suggestions.action_items.medium_priority.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-md font-semibold text-blue-600 mb-2">📌 Recommended Improvements</h5>
                    <ul className="space-y-2">
                      {result.ai_suggestions.action_items.medium_priority.slice(0, 5).map((item, idx) => (
                        <li key={idx} className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                          {typeof item === 'string' ? (
                            <p className="text-sm text-gray-800">{item}</p>
                          ) : (
                            <div>
                              <h6 className="font-semibold text-gray-900 mb-1">{item.title}</h6>
                              <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-blue-600 font-medium">{item.impact}</span>
                                <span className="text-gray-500">Effort: {item.effort}</span>
                              </div>
                              {item.example && (
                                <div className="mt-2 p-2 bg-white rounded text-xs text-gray-600 italic">
                                  💡 {item.example}
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                      {result.ai_suggestions.action_items.medium_priority.length > 5 && (
                        <li className="text-sm text-gray-500 italic">
                          + {result.ai_suggestions.action_items.medium_priority.length - 5} more recommendations
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Missing Keywords Gap Analysis */}
            {result.ai_suggestions.gap_analysis && result.ai_suggestions.gap_analysis.missing_keywords && 
             result.ai_suggestions.gap_analysis.missing_keywords.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3">🎯 Missing Keywords (Add These)</h4>
                <div className="flex flex-wrap gap-2">
                  {result.ai_suggestions.gap_analysis.missing_keywords.slice(0, 15).map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                  {result.ai_suggestions.gap_analysis.missing_keywords.length > 15 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{result.ai_suggestions.gap_analysis.missing_keywords.length - 15} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Competitive Analysis */}
            {result.ai_suggestions.competitive_analysis && result.ai_suggestions.competitive_analysis.message && (
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
                <h4 className="text-lg font-bold text-gray-900 mb-3">📊 Competitive Standing</h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  {result.ai_suggestions.competitive_analysis.message}
                </p>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-blue-900">
                      Percentile: {result.ai_suggestions.competitive_analysis.percentile}th
                    </span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-700">
                      {result.ai_suggestions.competitive_analysis.competitiveness}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback to basic insight if ai_suggestions not available */}
          </motion.div>
        )}
        
        {/* Fallback to old insight if new suggestions not available */}
        {!result.ai_suggestions && result.insight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-2xl p-8 shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LightBulbIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                AI-Powered Insights & Recommendations
              </h3>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result.insight}
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons - Download & Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          {/* Download PDF Button */}
          <button
            onClick={async () => {
              try {
                // Import html2pdf dynamically
                const html2pdf = (await import('html2pdf.js')).default;

                // Generate HTML document string
                const htmlContent = generatePDFContent(result);

                // Convert to PDF and download
                const opt = {
                  margin: [0.5, 0.5],
                  filename: `HireScope-Analysis-${new Date().toISOString().split('T')[0]}.pdf`,
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { 
                    scale: 2, 
                    logging: false, 
                    dpi: 192, 
                    letterRendering: true,
                    useCORS: true
                  },
                  jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait',
                    compress: true
                  },
                  pagebreak: { mode: ['css', 'legacy'] }
                };
                
                // Generate PDF directly from HTML string
                await html2pdf().set(opt).from(htmlContent).save();
              } catch (error) {
                console.error('Error generating PDF:', error);
                alert(`Error generating PDF: ${error.message || 'Please try again.'}`);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Report
          </button>

          {/* Share Buttons */}
          <div className="flex gap-3">
            {/* WhatsApp Share */}
            <button
              onClick={() => {
                const message = `🎯 Just analyzed my resume with HireScope!\n\n📊 Score: ${overallScore}%\n${getScoreLabel(overallScore)}\n\n✨ Try it yourself: ${window.location.origin}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
              title="Share on WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Email Share */}
            <button
              onClick={() => {
                const subject = 'Check out my HireScope Resume Analysis';
                const body = `Hi!\n\nI just analyzed my resume with HireScope and got a ${overallScore}% match score (${getScoreLabel(overallScore)}).\n\nThe AI-powered analysis provided comprehensive insights on:\n• ATS Compatibility\n• Keyword Optimization\n• Action Items\n• Competitive Standing\n\nTry it yourself: ${window.location.origin}\n\nBest regards`;
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              }}
              className="px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
              title="Share via Email"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Email</span>
            </button>
          </div>

          {/* New Analysis Button */}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 glass-effect rounded-xl font-semibold text-gray-900 hover:shadow-card transition-all"
          >
            Analyze Another Resume
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Helper function to generate PDF content
function generatePDFContent(result) {
  const overallScore = Math.round((result.scores?.composite || 0) * 100);
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const styles = `
    .pdf-report {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      width: 8in;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }
    .pdf-report .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #8b5cf6;
      padding-bottom: 20px;
    }
    .pdf-report .logo {
      font-size: 32px;
      font-weight: bold;
      background: linear-gradient(to right, #8b5cf6, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .pdf-report .score-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin: 30px 0;
    }
    .pdf-report .score-value {
      font-size: 64px;
      font-weight: bold;
      margin: 20px 0;
    }
    .pdf-report .section {
      margin: 30px 0;
      page-break-inside: avoid;
    }
    .pdf-report .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #8b5cf6;
      margin-bottom: 15px;
      border-left: 4px solid #8b5cf6;
      padding-left: 15px;
    }
    .pdf-report .metric {
      background: #f3f4f6;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .pdf-report .metric-label {
      font-weight: 600;
    }
    .pdf-report .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #8b5cf6;
    }
    .pdf-report .keyword-tag {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      padding: 5px 12px;
      margin: 5px;
      border-radius: 20px;
      font-size: 14px;
    }
    .pdf-report .missing-tag {
      background: #fee2e2;
      color: #991b1b;
    }
    .pdf-report .recommendation {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
    }
    .pdf-report .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>HireScope Resume Analysis Report</title>
  <style>${styles}</style>
</head>
<body>
<div class="pdf-report">
  <div class="header">
    <div class="logo">HireScope</div>
    <h1>Resume Analysis Report</h1>
    <p>Generated on ${date}</p>
  </div>

  <div class="score-section">
    <h2>Overall Match Score</h2>
    <div class="score-value">${overallScore}%</div>
    <p style="font-size: 18px;">${overallScore >= 80 ? 'Excellent Match' : overallScore >= 60 ? 'Good Match' : 'Needs Improvement'}</p>
  </div>

  <div class="section">
    <div class="section-title">📊 Score Breakdown</div>
    ${Object.entries({
      'Structural Quality': result.scores?.structural,
      'Keyword Match': result.scores?.keyword,
      'Semantic Relevance': result.scores?.semantic,
      'Readability': result.scores?.readability,
      'Tone & Impact': result.scores?.tone
    }).map(([label, score]) => `
      <div class="metric">
        <span class="metric-label">${label}</span>
        <span class="metric-value">${Math.round((score || 0) * 100)}/100</span>
      </div>
    `).join('')}
  </div>

  ${result.ai_suggestions?.ats_compatibility ? `
  <div class="section">
    <div class="section-title">🤖 ATS Compatibility</div>
    <div class="metric">
      <span class="metric-label">ATS Score</span>
      <span class="metric-value">${result.ai_suggestions.ats_compatibility.ats_score}/100</span>
    </div>
    ${result.ai_suggestions.ats_compatibility.issues?.length ? `
      <h4>Issues Found:</h4>
      <ul>
        ${result.ai_suggestions.ats_compatibility.issues.map(issue => `<li>${issue}</li>`).join('')}
      </ul>
    ` : ''}
  </div>
  ` : ''}

  ${result.keywords ? `
  <div class="section">
    <div class="section-title">🎯 Keyword Analysis</div>
    <p><strong>Match Rate:</strong> ${result.keywords.matched || 0} / ${result.keywords.required || 0} keywords (${result.keywords.required > 0 ? Math.round((result.keywords.matched / result.keywords.required) * 100) : 0}%)</p>
    
    ${result.keywords.matches?.length ? `
      <h4>✅ Matched Keywords:</h4>
      <div>
        ${result.keywords.matches.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
      </div>
    ` : ''}
    
    ${result.keywords.missing?.length ? `
      <h4>❌ Missing Keywords:</h4>
      <div>
        ${result.keywords.missing.slice(0, 15).map(kw => `<span class="keyword-tag missing-tag">${kw}</span>`).join('')}
      </div>
    ` : ''}
  </div>
  ` : ''}

  ${result.ai_suggestions?.action_items ? `
  <div class="section">
    <div class="section-title">📋 Recommended Actions</div>
    
    ${result.ai_suggestions.action_items.critical?.length ? `
      <h4>🚨 Critical (Fix Immediately):</h4>
      ${result.ai_suggestions.action_items.critical.map(item => `
        <div class="recommendation" style="border-color: #ef4444; background: #fee2e2;">
          ${typeof item === 'string' ? item : `<strong>${item.title}</strong><br>${item.description}`}
        </div>
      `).join('')}
    ` : ''}
    
    ${result.ai_suggestions.action_items.high_priority?.length ? `
      <h4>⚠️ High Priority:</h4>
      ${result.ai_suggestions.action_items.high_priority.map(item => `
        <div class="recommendation" style="border-color: #f59e0b;">
          ${typeof item === 'string' ? item : `<strong>${item.title}</strong><br>${item.description}`}
        </div>
      `).join('')}
    ` : ''}
  </div>
  ` : ''}

  ${result.ai_suggestions?.quick_wins?.length ? `
  <div class="section">
    <div class="section-title">⚡ Quick Wins</div>
    ${result.ai_suggestions.quick_wins.map(win => `
      <div class="recommendation" style="border-color: #10b981; background: #d1fae5;">
        ${win}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>HireScope</strong> - AI-Powered Resume Analysis</p>
    <p>This report was generated automatically. For best results, implement the recommendations and re-analyze your resume.</p>
  </div>
</div>
</body>
</html>
  `;
}
