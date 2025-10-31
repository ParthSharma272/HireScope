import React from 'react';
import { motion } from 'framer-motion';
import ATSSimulator from '../components/ATSSimulator';

export default function ATSSimulatorPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20"
    >
      {/* Page Header */}
      <div className="py-16 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              ATS Simulator
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-4">
              Discover exactly what Applicant Tracking Systems see when they scan your resume
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Most resumes are rejected by ATS before a human ever sees them. Our simulator shows you the hidden issues and helps you fix them.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ATS Simulator Component */}
      <ATSSimulator />

      {/* Info Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why ATS Compatibility Matters
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-purple-900 mb-3">
                📊 98% of Fortune 500 Companies
              </h4>
              <p className="text-gray-700">
                Use ATS systems to filter resumes before humans review them. If your resume isn't ATS-friendly, it may never be seen.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-900 mb-3">
                ⚠️ 75% of Resumes Are Rejected
              </h4>
              <p className="text-gray-700">
                By ATS systems due to formatting issues, missing keywords, or parsing errors - often for qualified candidates.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-green-900 mb-3">
                ✓ Simple Formatting Wins
              </h4>
              <p className="text-gray-700">
                Using standard fonts, clear sections, and avoiding tables/images dramatically improves your ATS score.
              </p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-yellow-900 mb-3">
                🎯 Keywords Are Critical
              </h4>
              <p className="text-gray-700">
                ATS systems match keywords from job descriptions. Our simulator helps you identify what's being detected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
