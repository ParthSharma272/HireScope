import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onBuildResume }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center py-8 md:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 md:pt-0 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Enhanced Tagline and CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative md:-mt-20 order-2 md:order-1"
          >
            {/* Background decorative elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 -left-5 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Advanced AI/ML Pipeline
                  </span>
                </div>
              </motion.div>

              {/* Main Headline with Gradient Underline */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight relative"
                >
                  <span className="relative inline-block">
                    Next-Gen
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 rounded-full"></div>
                  </span>
                  {" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI-Powered
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-600 to-blue-600 opacity-30 blur-sm rounded-full"></div>
                  </span>
                  {" "}
                  Resume Analysis
                </motion.h1>
              </div>

              {/* Feature Points with Icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 py-4"
              >
                {[
                  { icon: '🧠', text: 'Transformer-based NLP with semantic embeddings', gradient: 'from-purple-500 to-purple-600' },
                  { icon: '⚡', text: 'RAG architecture with vector similarity search', gradient: 'from-blue-500 to-blue-600' },
                  { icon: '🎯', text: 'Multi-model ensemble scoring system', gradient: 'from-pink-500 to-purple-600' }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-start gap-3 md:gap-4 group"
                  >
                    <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-base md:text-lg">{feature.icon}</span>
                    </div>
                    <p className="text-base md:text-lg text-gray-700 font-medium pt-1 md:pt-2">
                      {feature.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-4 pt-2"
              >
                {/* Primary CTA Button */}
                <div className="relative inline-block w-full sm:w-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                  <button
                    onClick={onBuildResume}
                    className="relative group px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white text-base md:text-lg font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                      <span>Explore the Architecture</span>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        ⚙️
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Secondary Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Open-source ML models</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">FastAPI + React architecture</span>
                  </div>
                </div>
              </motion.div>

              {/* Social Proof Section - Enhanced */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="pt-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  {/* Avatar Stack with Hover Effects */}
                  <div className="flex -space-x-3">
                    {[
                      { letter: 'A', gradient: 'from-purple-400 to-purple-600' },
                      { letter: 'B', gradient: 'from-blue-400 to-blue-600' },
                      { letter: 'C', gradient: 'from-pink-400 to-pink-600' },
                      { letter: 'D', gradient: 'from-indigo-400 to-indigo-600' },
                      { letter: 'E', gradient: 'from-cyan-400 to-cyan-600' }
                    ].map((avatar, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatar.gradient} border-3 border-white flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-pointer transition-all duration-300`}
                      >
                        {avatar.letter}
                      </motion.div>
                    ))}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-3 border-white flex items-center justify-center text-gray-600 font-bold text-xs shadow-lg">
                      +2K
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Trusted by <span className="text-purple-600 font-bold">2,000+</span> job seekers
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Enhanced Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 md:order-2"
          >
            {/* Main Resume Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Gradient Header Background */}
              <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-purple-600/10"></div>
              
              <div className="relative p-4 sm:p-6 md:p-8">
                {/* Header Section with Avatar */}
                <div className="flex items-start justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Professional Avatar with Ring */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-md opacity-40"></div>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-xl">
                        <span className="text-2xl md:text-3xl font-bold text-white">SC</span>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0.5 right-0.5 md:bottom-1 md:right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1">Sarah Chen</h3>
                      <p className="text-sm md:text-base text-gray-600 font-medium">Senior Product Manager</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">📍 San Francisco, CA</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">💼 8+ years</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Badge - Enhanced */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl px-3 py-2 md:px-5 md:py-3 text-center shadow-lg">
                      <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">87%</div>
                      <div className="text-xs font-bold uppercase tracking-wide text-green-700">ATS Score</div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </motion.div>
                </div>

                {/* Contact Info Bar */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6 p-2 md:p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-600">📧 sarah.chen@email.com</span>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <span className="text-xs text-gray-600">📱 (555) 123-4567</span>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <span className="text-xs text-blue-600">🔗 LinkedIn</span>
                </div>

                {/* Professional Summary Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Professional Summary</h4>
                  </div>
                  <div className="space-y-2 pl-3">
                    <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-full"></div>
                    <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-11/12"></div>
                    <div className="h-2.5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full w-4/5"></div>
                  </div>
                </div>

                {/* Experience Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Work Experience</h4>
                  </div>
                  <div className="space-y-4 pl-3">
                    {/* Experience Item 1 */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-300 rounded-full w-2/3"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-20"></div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 bg-gradient-to-r from-purple-300 to-purple-200 rounded-full w-5/6"></div>
                        <div className="h-2 bg-gradient-to-r from-purple-300 to-purple-200 rounded-full w-3/4"></div>
                        <div className="h-2 bg-gradient-to-r from-purple-300 to-purple-200 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    
                    {/* Experience Item 2 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full w-3/5"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-20"></div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 bg-gradient-to-r from-blue-300 to-blue-200 rounded-full w-4/5"></div>
                        <div className="h-2 bg-gradient-to-r from-blue-300 to-blue-200 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section with Progress Bars */}
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide">Key Skills</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 pl-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">Leadership</span>
                        <span className="text-xs text-purple-600 font-bold">95%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "95%" }}
                          transition={{ duration: 1, delay: 0.8 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">Strategy</span>
                        <span className="text-xs text-blue-600 font-bold">92%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ duration: 1, delay: 0.9 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keywords/Tags Section - Enhanced */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-pink-600 to-purple-600 rounded-full"></div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Technical Skills</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-3">
                    {[
                      { name: 'Python', color: 'from-blue-500 to-blue-600' },
                      { name: 'Leadership', color: 'from-purple-500 to-purple-600' },
                      { name: 'Agile', color: 'from-green-500 to-green-600' },
                      { name: 'SQL', color: 'from-orange-500 to-orange-600' },
                      { name: 'Analytics', color: 'from-pink-500 to-pink-600' },
                      { name: 'Product Strategy', color: 'from-indigo-500 to-indigo-600' }
                    ].map((skill, idx) => (
                      <motion.span
                        key={skill.name}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 + idx * 0.1, type: "spring" }}
                        className={`px-3 py-1.5 bg-gradient-to-r ${skill.color} text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer`}
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Gradient Bar */}
              <div className="h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600"></div>
            </div>

            {/* Floating Badges - Enhanced */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -left-2 md:-top-4 md:-left-4 z-10"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl shadow-2xl border-2 border-blue-400">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-base md:text-lg">✓</span>
                  <span className="text-xs md:text-sm font-bold">ATS Optimized</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 z-10"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl shadow-2xl border-2 border-green-400">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-base md:text-lg">🚀</span>
                  <span className="text-xs md:text-sm font-bold">+45 Points</span>
                </div>
              </div>
            </motion.div>

            {/* Additional floating metric badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 -right-4 md:-right-6 z-10 hidden md:block"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg shadow-xl">
                <div className="text-xs font-bold">95% Match</div>
              </div>
            </motion.div>

            {/* Decorative elements - Enhanced */}
            <div className="absolute -z-10 top-10 -right-10 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-20"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
