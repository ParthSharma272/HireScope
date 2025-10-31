import React from "react";
import { motion } from "framer-motion";
import {
  CpuChipIcon,
  BeakerIcon,
  ChartBarIcon,
  CodeBracketIcon,
  ServerIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  BoltIcon,
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  const developerSkills = [
    { name: "Full-Stack Development", level: 95 },
    { name: "AI/Machine Learning", level: 90 },
    { name: "React & Modern Frontend", level: 95 },
    { name: "Python & FastAPI", level: 92 },
    { name: "Cloud & DevOps", level: 85 },
    { name: "System Architecture", level: 88 },
  ];
  const techStack = [
    {
      category: "Frontend",
      icon: CodeBracketIcon,
      color: "from-purple-500 to-blue-600",
      technologies: [
        { name: "React 19", description: "Latest React with concurrent features" },
        { name: "Vite", description: "Lightning-fast build tool" },
        { name: "Framer Motion", description: "Smooth animations" },
        { name: "TailwindCSS", description: "Utility-first styling" },
        { name: "Axios", description: "HTTP client for API calls" },
        { name: "Heroicons", description: "Beautiful icon library" },
      ],
    },
    {
      category: "Backend",
      icon: ServerIcon,
      color: "from-green-500 to-emerald-600",
      technologies: [
        { name: "FastAPI", description: "High-performance Python framework" },
        { name: "Python 3.13", description: "Latest Python features" },
        { name: "Uvicorn", description: "Lightning-fast ASGI server" },
        { name: "PyPDF2", description: "PDF text extraction" },
        { name: "python-docx", description: "DOCX parsing" },
        { name: "pytesseract", description: "OCR for scanned PDFs" },
      ],
    },
    {
      category: "AI/ML",
      icon: CpuChipIcon,
      color: "from-orange-500 to-red-600",
      technologies: [
        { name: "Sentence Transformers", description: "State-of-the-art embeddings" },
        { name: "all-MiniLM-L6-v2", description: "Fast semantic similarity model" },
        { name: "FAISS", description: "Vector similarity search" },
        { name: "spaCy", description: "NLP processing" },
        { name: "Custom RAG", description: "Retrieval-Augmented Generation" },
        { name: "Keyword Extraction", description: "Weighted matching algorithms" },
      ],
    },
  ];

  const features = [
    {
      title: "Smart Resume Parsing",
      description: "Extract text from PDF and DOCX files with OCR fallback for scanned documents",
      icon: DocumentTextIcon,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Semantic Analysis",
      description: "AI-powered embeddings analyze meaning, not just keywords",
      icon: BeakerIcon,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "ATS Simulation",
      description: "See exactly what Applicant Tracking Systems see in your resume",
      icon: ShieldCheckIcon,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Batch Processing",
      description: "Compare multiple candidates simultaneously for efficient hiring",
      icon: UserGroupIcon,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Skill Detection",
      description: "Automatically identify technical skills and experience levels",
      icon: AcademicCapIcon,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Real-time Scoring",
      description: "Get instant feedback with detailed metrics and suggestions",
      icon: ChartBarIcon,
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  const architecture = [
    {
      step: "1",
      title: "Document Upload",
      description: "User uploads resume (PDF/DOCX) and job description",
      details: "Supports drag-and-drop, multi-file uploads, and various document formats",
    },
    {
      step: "2",
      title: "Text Extraction",
      description: "Advanced parsing with PyPDF2, python-docx, and OCR",
      details: "Handles scanned documents, complex layouts, and preserves formatting context",
    },
    {
      step: "3",
      title: "AI Processing",
      description: "Semantic embeddings using Sentence Transformers",
      details: "Converts text to 384-dimensional vectors for deep semantic understanding",
    },
    {
      step: "4",
      title: "Multi-Factor Analysis",
      description: "Keyword matching, skill detection, and weighted scoring",
      details: "Combines NLP, pattern matching, and ML for comprehensive evaluation",
    },
    {
      step: "5",
      title: "RAG-Enhanced Insights",
      description: "Retrieval-Augmented Generation for contextual suggestions",
      details: "Uses vector similarity to find relevant improvements from knowledge base",
    },
    {
      step: "6",
      title: "Results Dashboard",
      description: "Beautiful visualizations with actionable insights",
      details: "Charts, scores, suggestions, and before/after comparisons",
    },
  ];

  const stats = [
    { label: "AI Models", value: "5+", icon: CpuChipIcon },
    { label: "Processing Speed", value: "<3s", icon: BoltIcon },
    { label: "Accuracy Rate", value: "95%+", icon: SparklesIcon },
    { label: "Features", value: "20+", icon: RocketLaunchIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <CpuChipIcon className="w-16 h-16" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About HireScope
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              An AI-powered resume analysis platform leveraging cutting-edge NLP, 
              semantic embeddings, and machine learning to revolutionize hiring.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-purple-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Developer Profile Section - PROMINENT PLACEMENT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Profile Image & Quick Info */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Profile Card */}
                <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-1 shadow-2xl">
                  <div className="bg-white rounded-3xl p-8">
                    {/* Avatar */}
                    <div className="flex justify-center mb-6">
                      <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-xl">
                        PS
                      </div>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-gray-900 text-center mb-2">
                      Parth Sharma
                    </h2>
                    <p className="text-xl text-purple-600 font-semibold text-center mb-6">
                      Full-Stack AI/ML Developer
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 border-t border-b border-gray-200 py-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">5+</div>
                        <div className="text-sm text-gray-600">Years Exp</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">20+</div>
                        <div className="text-sm text-gray-600">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">100%</div>
                        <div className="text-sm text-gray-600">Dedication</div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                      <a
                        href="https://www.linkedin.com/in/parth-sharma-08b1b424b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                      <a
                        href="https://portfolio-website-f311.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        <RocketLaunchIcon className="w-5 h-5" />
                        Portfolio
                      </a>
                    </div>

                    <a
                      href="https://github.com/ParthSharma272/HireScope"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-200 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10"></div>
              </motion.div>
            </div>

            {/* Right: About & Skills */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Meet the Developer
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Hi, I'm <span className="font-bold text-purple-600">Parth Sharma</span>, a passionate full-stack developer 
                  specializing in <span className="font-semibold">AI/ML integration</span> and modern web technologies. 
                  I built HireScope to solve a real problem: the disconnect between talented candidates and 
                  ATS (Applicant Tracking Systems).
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  With expertise in <span className="font-semibold">React, Python, FastAPI, and Machine Learning</span>, 
                  I combine cutting-edge AI models with intuitive UX design to create tools that make a difference. 
                  HireScope leverages <span className="font-semibold">Sentence Transformers, semantic embeddings, 
                  and RAG (Retrieval-Augmented Generation)</span> to provide insights that go beyond simple keyword matching.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  I believe in building products that are not only technically impressive but also genuinely useful. 
                  Every feature in HireScope is designed with the user in mind—whether that's a job seeker optimizing 
                  their resume or a recruiter comparing multiple candidates.
                </p>

                {/* Skills Progress Bars */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Expertise</h3>
                  <div className="space-y-4">
                    {developerSkills.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-700">{skill.name}</span>
                          <span className="text-purple-600 font-bold">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 + 0.1 * index }}
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
                    <BriefcaseIcon className="w-8 h-8 text-purple-600 mb-2" />
                    <div className="font-bold text-gray-900">Industry Ready</div>
                    <div className="text-sm text-gray-600">Production-grade code</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                    <SparklesIcon className="w-8 h-8 text-blue-600 mb-2" />
                    <div className="font-bold text-gray-900">AI Specialist</div>
                    <div className="text-sm text-gray-600">ML & NLP expert</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">
            Built with modern AI and intuitive design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600">
              Built with industry-leading technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techStack.map((stack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stack.color} rounded-xl flex items-center justify-center mb-6`}>
                  <stack.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {stack.category}
                </h3>
                <div className="space-y-4">
                  {stack.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-semibold text-gray-900">{tech.name}</div>
                        <div className="text-sm text-gray-600">{tech.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Architecture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              System Architecture
            </h2>
            <p className="text-xl text-gray-600">
              End-to-end AI pipeline for intelligent resume analysis
            </p>
          </motion.div>

          <div className="space-y-8">
            {architecture.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-700 mb-3">
                    {step.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to optimize your resume?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Get instant AI-powered feedback and land your dream job faster.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Analyze Your Resume Now
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
