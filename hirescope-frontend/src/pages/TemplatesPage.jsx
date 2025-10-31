import React from 'react';
import { motion } from 'framer-motion';
import Templates from '../components/Templates';

export default function TemplatesPage() {
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
              Professional Resume Templates
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-4">
              Choose from our collection of industry-specific, ATS-optimized templates
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Each template is designed by experts and includes sample bullet points with metrics to help you get started
            </p>
          </motion.div>
        </div>
      </div>

      {/* Templates Component */}
      <Templates />
    </motion.div>
  );
}
