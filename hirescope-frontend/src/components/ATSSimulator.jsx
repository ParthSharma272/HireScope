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
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function ATSSimulator() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('original'); // 'original' or 'ats'

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
      const response = await axios.post(
        'http://127.0.0.1:8000/api/ats/simulate',
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

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.statistics.total_lines}</div>
                  <div className="text-sm text-gray-600">Lines Detected</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.statistics.emails_found}</div>
                  <div className="text-sm text-gray-600">Email(s) Found</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.statistics.phones_found}</div>
                  <div className="text-sm text-gray-600">Phone(s) Found</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{result.statistics.sections_detected.length}</div>
                  <div className="text-sm text-gray-600">Sections Detected</div>
                </div>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Parsing Issues Detected</h3>
                <div className="space-y-4">
                  {result.issues.map((issue, idx) => (
                    <div
                      key={idx}
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
