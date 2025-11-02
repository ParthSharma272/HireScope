import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ onLogoClick, onAboutClick, onTemplatesClick, onATSClick, onBatchClick, onResumeMatchClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (callback) => {
    callback();
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex items-center gap-2 cursor-pointer z-50"
            onClick={onLogoClick}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900">HireScope</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={onAboutClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 text-sm"
            >
              About
            </button>

            <button
              onClick={onResumeMatchClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 text-sm"
            >
              Resume Match
            </button>

            <button
              onClick={onTemplatesClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 text-sm"
            >
              Templates
            </button>

            <button
              onClick={onATSClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 text-sm"
            >
              ATS Check
            </button>

            <button
              onClick={onBatchClick}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 text-sm"
            >
              Batch Analysis
            </button>
            
            {/* Repo Button */}
            <a
              href="https://github.com/ParthSharma272/HireScope"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-500 hover:border-purple-600 text-gray-900 rounded-full font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 ml-2 text-sm"
            >
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-semibold">Repo</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors z-50"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => handleNavClick(onAboutClick)}
                className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-4 py-3 rounded-lg"
              >
                About
              </button>

              <button
                onClick={() => handleNavClick(onResumeMatchClick)}
                className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-4 py-3 rounded-lg"
              >
                Resume Match
              </button>

              <button
                onClick={() => handleNavClick(onTemplatesClick)}
                className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-4 py-3 rounded-lg"
              >
                Templates
              </button>

              <button
                onClick={() => handleNavClick(onATSClick)}
                className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-4 py-3 rounded-lg"
              >
                ATS Check
              </button>

              <button
                onClick={() => handleNavClick(onBatchClick)}
                className="w-full text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-4 py-3 rounded-lg"
              >
                Batch Analysis
              </button>
              
              <a
                href="https://github.com/ParthSharma272/HireScope"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md mt-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">GitHub Repo</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
