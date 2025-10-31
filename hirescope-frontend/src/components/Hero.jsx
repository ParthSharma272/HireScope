import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onBuildResume }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Column - Tagline and CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Build a job-winning resume for free
            </h1>
            
            <p className="text-2xl text-gray-600 mb-6">
              Your first resume is 100% free forever.
            </p>
            
            <p className="text-xl text-gray-600 mb-6">
              Unlimited analysis. No hidden fees.
            </p>
            
            <p className="text-xl text-gray-600 mb-12">
              Yes, really 🚀
            </p>

            {/* CTA Button */}
            <button
              onClick={onBuildResume}
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">Build your resume - it's free ✨</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white flex items-center justify-center text-white font-bold text-lg"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-base text-gray-600 font-medium">
                Trusted by thousands of job seekers
              </p>
            </div>
          </motion.div>

          {/* Right Column - Example Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Resume Card with Before/After Preview */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
              {/* Header */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-5"></div>
                <h3 className="text-3xl font-bold text-gray-900">Sarah Chen</h3>
                <p className="text-xl text-gray-600">Product Manager</p>
              </div>

              {/* Score Badge */}
              <div className="absolute top-10 right-10">
                <div className="bg-green-50 border-2 border-green-500 rounded-xl px-5 py-3 text-center">
                  <div className="text-4xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-green-700 font-semibold">ATS Score</div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-5 mb-8">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                
                <div className="pt-6">
                  <div className="h-3 bg-purple-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-purple-200 rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-purple-200 rounded w-5/6"></div>
                </div>
              </div>

              {/* Keywords Preview */}
              <div className="flex flex-wrap gap-3">
                {['Python', 'Leadership', 'Agile', 'SQL', 'Analytics'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-purple-100 text-purple-700 text-base font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-5 -left-5 bg-blue-500 text-white px-5 py-3 rounded-lg shadow-lg text-base font-semibold"
              >
                ✓ ATS Optimized
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, delay: 1, repeat: Infinity }}
                className="absolute -bottom-5 -right-5 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg text-base font-semibold"
              >
                🚀 +45 Points
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
