import React from "react";
import { motion } from "framer-motion";
import BatchAnalysis from "../components/BatchAnalysis";
import {
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function BatchAnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block p-4 bg-white/20 rounded-2xl backdrop-blur-sm mb-6"
            >
              <UsersIcon className="w-16 h-16" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-6">Batch Resume Analysis</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Compare multiple candidates against a single job description. Perfect for recruiters, hiring managers, and users testing different resume versions.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <ClockIcon className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Save Time</h3>
                <p className="text-purple-100 text-sm">
                  Analyze up to 10 resumes simultaneously instead of one by one
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <ChartBarIcon className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Compare Easily</h3>
                <p className="text-purple-100 text-sm">
                  Side-by-side comparison table with scores and rankings
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <SparklesIcon className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Export Results</h3>
                <p className="text-purple-100 text-sm">
                  Download comparison data as CSV for further analysis
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Use Cases Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">For Recruiters</h3>
            <p className="text-gray-700 leading-relaxed">
              Screen multiple candidates efficiently. Identify top performers at a glance. 
              Make data-driven hiring decisions with objective scoring and comparison metrics.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">For Job Seekers</h3>
            <p className="text-gray-700 leading-relaxed">
              A/B test different versions of your resume. See which format scores better. 
              Optimize before applying by comparing variations against the job description.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Upload Resumes</h4>
              <p className="text-sm text-gray-600">Drag & drop up to 10 PDF or DOCX files</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Add Job Description</h4>
              <p className="text-sm text-gray-600">Paste the complete job posting</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Analyze</h4>
              <p className="text-sm text-gray-600">Our AI compares all resumes instantly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Export & Decide</h4>
              <p className="text-sm text-gray-600">Review rankings and export results</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Component */}
      <BatchAnalysis />

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 mt-20"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Ready to streamline your hiring process?</h3>
          <p className="text-xl text-purple-100 mb-8">
            Start comparing candidates today and make better hiring decisions faster.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Start Batch Analysis
          </button>
        </div>
      </motion.div>
    </div>
  );
}
