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
} from "@heroicons/react/24/outline";

export default function AboutPage() {
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
        { name: "python-docx", description: "DOCX parsing & generation" },
        { name: "pytesseract", description: "OCR for scanned PDFs" },
        { name: "Redis", description: "High-performance caching layer" },
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
      title: "AI Template Generation",
      description: "Create professional, ATS-optimized resume templates with industry-specific formatting",
      icon: SparklesIcon,
      gradient: "from-violet-500 to-purple-500",
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
  ];

  const architecture = [
    {
      step: "1",
      title: "Document Upload & Template Selection",
      description: "Upload resume (PDF/DOCX) or generate from AI templates",
      details: "Supports drag-and-drop, multi-file uploads, and 4 industry-specific template styles",
    },
    {
      step: "2",
      title: "Text Extraction & Parsing",
      description: "Advanced parsing with PyPDF2, python-docx, and OCR",
      details: "Handles scanned documents, complex layouts, and preserves formatting context",
    },
    {
      step: "3",
      title: "AI Processing & Classification",
      description: "Semantic embeddings using Sentence Transformers",
      details: "Converts text to 384-dimensional vectors for deep semantic understanding and role detection",
    },
    {
      step: "4",
      title: "Multi-Factor Analysis",
      description: "Keyword matching, skill detection, and weighted scoring",
      details: "7 specialized analysis modules with ATS simulation and gap analysis",
    },
    {
      step: "5",
      title: "RAG-Enhanced Insights",
      description: "Retrieval-Augmented Generation for contextual suggestions",
      details: "60+ expert tips with before/after examples and priority-based recommendations",
    },
    {
      step: "6",
      title: "Results & Export",
      description: "Comprehensive dashboard with multiple export options",
      details: "Interactive charts, downloadable reports, and professional DOCX templates",
    },
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
          </div>
        </div>
      </motion.div>

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

      {/* Learn More - Technical Deep Dive CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 rounded-2xl p-12 shadow-xl border border-purple-100"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Want to Learn More About the Tech?
            </h3>
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              Dive deeper into the technical architecture, AI/ML implementation details, and behind-the-scenes insights on my technical blog.
            </p>
            <p className="text-base text-gray-600 mb-8">
              I write about building AI-powered applications, NLP techniques, semantic embeddings, and practical software engineering tutorials.
            </p>
            
            <motion.a
              href="https://medium.com/@parthsharma23212"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
              Read Technical Articles on Medium
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>AI & Machine Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Software Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Technical Tutorials</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Connect Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Connect with Me
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Check out my work and let's connect on social platforms
            </p>
            
            {/* Social Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <a
                href="https://www.linkedin.com/in/parth-sharma-08b1b424b/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                Portfolio
              </a>
              <a
                href="https://github.com/ParthSharma272/HireScope"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </motion.div>
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
