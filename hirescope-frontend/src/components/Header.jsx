import React from "react";
import { motion } from "framer-motion";

export default function Header({ onLogoClick, onAboutClick, onTemplatesClick, onATSClick, onBatchClick }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Seamlessly integrated */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={onLogoClick}
          >
            {/* Simple clean logo */}
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">hirescope</span>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <button
              onClick={onAboutClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </button>

            <button
              onClick={onTemplatesClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Templates
            </button>

            <button
              onClick={onATSClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ATS Simulator
            </button>

            <button
              onClick={onBatchClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Batch Analysis
            </button>
            
            {/* Repo Button with pink/purple outline */}
            <a
              href="https://github.com/ParthSharma272/HireScope"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-500 hover:border-purple-600 text-gray-900 rounded-full font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
            >
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-semibold">Repo</span>
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
