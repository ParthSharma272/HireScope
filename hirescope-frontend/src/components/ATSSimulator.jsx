import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  EyeIcon,
  BeakerIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

export default function ATSSimulator() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('original'); // 'original' or 'ats'
  const [expandedSections, setExpandedSections] = useState({
    sections: false,
    contacts: false,
    socials: false,
    specialChars: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const simulateATS = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${apiUrl}/api/ats/simulate`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );
      setResult(response.data);
    } catch (err) {
      console.error('ATS simulation error:', err);
      setError(
        err.response?.data?.detail ||
        'Failed to simulate ATS parsing. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <section id="ats-simulator" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <BeakerIcon className="w-12 h-12 text-purple-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                ATS Simulator
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly what Applicant Tracking Systems see when they parse your resume
            </p>
            <p className="text-gray-500 mt-2">
              Upload your resume to visualize parsing issues and get ATS compatibility insights
            </p>
          </motion.div>
        </div>

        {/* Upload Section */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer bg-white"
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="ats-file-upload"
              />
              <label htmlFor="ats-file-upload" className="cursor-pointer">
                <ArrowUpTrayIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {file ? file.name : 'Drop your resume here or click to browse'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF and DOCX files
                </p>
              </label>
            </div>

            {file && (
              <div className="mt-6 text-center">
                <button
                  onClick={simulateATS}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Simulating ATS Parsing...
                    </span>
                  ) : (
                    'Simulate ATS Parsing'
                  )}
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">ATS Compatibility Score</h3>
                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                  }}
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                >
                  Test Another Resume
                </button>
              </div>

              <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl ${getScoreColor(result.ats_score)}`}>
                <ChartBarIcon className="w-8 h-8" />
                <div>
                  <div className="text-4xl font-bold">{result.ats_score}%</div>
                  <div className="text-sm font-medium">ATS Compatible</div>
                </div>
              </div>

              {/* Statistics - Reorganized into 4 Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {/* 1. Lines Detected - Static */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.statistics.total_lines}</div>
                  <div className="text-sm text-gray-600">Lines Detected</div>
                </div>
                
                {/* 2. Socials - Clickable */}
                <button
                  onClick={() => toggleSection('socials')}
                  className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors text-left cursor-pointer border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-900">
                        {result.statistics.social_urls?.length || 0}
                      </div>
                      <div className="text-sm text-blue-700">Social Links</div>
                    </div>
                    {result.statistics.social_urls && result.statistics.social_urls.length > 0 && (
                      <ChevronDownIcon className={`w-5 h-5 text-blue-400 transition-transform ${expandedSections.socials ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </button>
                
                {/* 3. Contacts - Clickable */}
                <button
                  onClick={() => toggleSection('contacts')}
                  className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors text-left cursor-pointer border border-green-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-900">
                        {result.statistics.emails_found + result.statistics.phones_found}
                      </div>
                      <div className="text-sm text-green-700">Contact Details</div>
                    </div>
                    {(result.statistics.emails_found + result.statistics.phones_found) > 0 && (
                      <ChevronDownIcon className={`w-5 h-5 text-green-400 transition-transform ${expandedSections.contacts ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </button>
                
                {/* 4. Resume Sections - Clickable */}
                <button
                  onClick={() => toggleSection('sections')}
                  className="bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors text-left cursor-pointer border border-purple-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-900">{result.statistics.sections_detected}</div>
                      <div className="text-sm text-purple-700">Resume Sections</div>
                    </div>
                    {result.statistics.sections_detected > 0 && (
                      <ChevronDownIcon className={`w-5 h-5 text-purple-400 transition-transform ${expandedSections.sections ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </button>
              </div>

              {/* Expandable Details */}
              <AnimatePresence>
                {/* 1. Resume Sections List */}
                {expandedSections.sections && result.statistics.sections_list && result.statistics.sections_list.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-200"
                  >
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <DocumentTextIcon className="w-5 h-5" />
                      Resume Sections Detected
                    </h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Your resume is organized into the following sections:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.statistics.sections_list.map((section, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium border border-purple-200 capitalize"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 2. Social Links */}
                {expandedSections.socials && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200"
                  >
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Social Media & Portfolio Links
                    </h4>
                    <div className="space-y-2">
                      {(() => {
                        const socialUrls = result.statistics.social_urls || [];
                        
                        if (socialUrls.length === 0) {
                          return <p className="text-blue-700 text-sm">No social media links detected</p>;
                        }
                        
                        return socialUrls.map((url, idx) => {
                          let platform = 'Website';
                          let icon = '🌐';
                          const urlLower = url.toLowerCase();
                          
                          if (urlLower.includes('linkedin')) { platform = 'LinkedIn'; icon = '💼'; }
                          else if (urlLower.includes('github')) { platform = 'GitHub'; icon = '💻'; }
                          else if (urlLower.includes('twitter')) { platform = 'Twitter'; icon = '🐦'; }
                          else if (urlLower.includes('facebook')) { platform = 'Facebook'; icon = '👤'; }
                          else if (urlLower.includes('instagram')) { platform = 'Instagram'; icon = '📸'; }
                          else if (urlLower.includes('portfolio')) { platform = 'Portfolio'; icon = '🎨'; }
                          else if (urlLower.includes('behance')) { platform = 'Behance'; icon = '🎨'; }
                          else if (urlLower.includes('dribbble')) { platform = 'Dribbble'; icon = '🎨'; }
                          else if (urlLower.includes('medium')) { platform = 'Medium'; icon = '📝'; }
                          else if (urlLower.includes('stackoverflow')) { platform = 'Stack Overflow'; icon = '💬'; }
                          else if (urlLower.includes('gitlab')) { platform = 'GitLab'; icon = '🦊'; }
                          
                          return (
                            <div key={idx} className="flex items-center gap-3 px-3 py-2 bg-white text-blue-700 rounded-md border border-blue-200">
                              <span className="text-lg">{icon}</span>
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-blue-900">{platform}</div>
                                <div className="text-sm font-mono break-all">{url}</div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </motion.div>
                )}

                {/* 3. Contact Details */}
                {expandedSections.contacts && result.original_text && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200"
                  >
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      Contact Information Found
                    </h4>
                    <div className="space-y-3">
                      {/* Emails */}
                      {(() => {
                        const emails = result.original_text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
                        return emails.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-green-900 mb-1 flex items-center gap-1">
                              <span>📧</span> Email Address{emails.length > 1 ? 'es' : ''}
                            </div>
                            <div className="space-y-1">
                              {emails.map((email, idx) => (
                                <div key={idx} className="px-3 py-2 bg-white text-green-700 rounded-md text-sm font-mono border border-green-200">
                                  {email}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {/* Phones */}
                      {(() => {
                        const phones = result.original_text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
                        return phones.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-green-900 mb-1 flex items-center gap-1">
                              <span>📞</span> Phone Number{phones.length > 1 ? 's' : ''}
                            </div>
                            <div className="space-y-1">
                              {phones.map((phone, idx) => (
                                <div key={idx} className="px-3 py-2 bg-white text-green-700 rounded-md text-sm font-mono border border-green-200">
                                  {phone}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {(() => {
                        const emails = result.original_text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
                        const phones = result.original_text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];
                        return (emails.length === 0 && phones.length === 0) && (
                          <p className="text-green-700 text-sm">No contact information detected</p>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Parsing Issues Detected</h3>
                <div className="space-y-4">
                  {result.issues.map((issue, idx) => (
                    <div key={idx}>
                      <div
                        className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start gap-3">
                          <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{issue.message}</h4>
                            <p className="text-sm opacity-90">💡 {issue.suggestion}</p>
                          </div>
                          <span className="text-xs font-bold uppercase px-2 py-1 rounded">
                            {issue.severity}
                          </span>
                        </div>
                      </div>
                      
                      {/* Show special characters details if this is a special_characters issue */}
                      {issue.type === 'special_characters' && result.original_text && (
                        <div className="mt-2 ml-9">
                          <button
                            onClick={() => toggleSection('specialChars')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            {expandedSections.specialChars ? 'Hide' : 'Show'} special characters found
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${expandedSections.specialChars ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {expandedSections.specialChars && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 bg-yellow-50 rounded-lg p-3 border border-yellow-200"
                              >
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    const specialChars = result.original_text.match(/[^\w\s\-.,@()\[\]:/;'"!?#%&+=<>|\n\r\t]/g) || [];
                                    const uniqueChars = [...new Set(specialChars)];
                                    return uniqueChars.length > 0 ? (
                                      <>
                                        <p className="w-full text-xs text-yellow-700 mb-2">
                                          Found {specialChars.length} special character(s) - {uniqueChars.length} unique:
                                        </p>
                                        {uniqueChars.slice(0, 30).map((char, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-1 bg-white text-yellow-700 rounded text-sm font-mono border border-yellow-300"
                                            title={`Character code: ${char.charCodeAt(0)}`}
                                          >
                                            {char}
                                          </span>
                                        ))}
                                        {uniqueChars.length > 30 && (
                                          <span className="text-xs text-yellow-600 italic">
                                            ...and {uniqueChars.length - 30} more
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-yellow-700 text-sm">No problematic special characters found</p>
                                    );
                                  })()}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Side-by-Side Comparison */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                What You See vs. What ATS Sees
              </h3>

              {/* View Toggle */}
              <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setView('original')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    view === 'original'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <EyeIcon className="w-5 h-5 inline mr-2" />
                  Original Text
                </button>
                <button
                  onClick={() => setView('ats')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    view === 'ats'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                  ATS Parsed
                </button>
              </div>

              {/* Text Display */}
              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                  {view === 'original' ? result.original_text : result.ats_parsed_text}
                </pre>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p>
                  {view === 'original'
                    ? 'This is the raw text extracted from your resume file.'
                    : 'This is how ATS systems parse your resume - special characters are converted, formatting is removed.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
