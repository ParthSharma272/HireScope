import { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import UploadZone from "./components/UploadZone";
import ResultsDashboard from "./components/ResultsDashboard";
import BeforeAfter from "./components/BeforeAfter";
import ResumeTips from "./components/ResumeTips";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import TemplatesPage from "./pages/TemplatesPage";
import ATSSimulatorPage from "./pages/ATSSimulatorPage";
import BatchAnalysisPage from "./pages/BatchAnalysisPage";
import AboutPage from "./pages/AboutPage";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);

  const openAnalyzer = () => {
    setShowAnalyzer(true);
    setShowTemplates(false);
    setShowATS(false);
    setShowBatch(false);
    setShowAboutPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTemplates = () => {
    setShowTemplates(true);
    setShowAnalyzer(false);
    setShowATS(false);
    setShowBatch(false);
    setShowAboutPage(false);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openATS = () => {
    setShowATS(true);
    setShowAnalyzer(false);
    setShowTemplates(false);
    setShowBatch(false);
    setShowAboutPage(false);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBatch = () => {
    setShowBatch(true);
    setShowAnalyzer(false);
    setShowTemplates(false);
    setShowATS(false);
    setShowAboutPage(false);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAboutPage = () => {
    setShowAboutPage(true);
    setShowAnalyzer(false);
    setShowTemplates(false);
    setShowATS(false);
    setShowBatch(false);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setShowAnalyzer(false);
    setShowTemplates(false);
    setShowATS(false);
    setShowBatch(false);
    setShowAboutPage(false);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpload = async (file, jobDescription) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await axios.post(
        `${apiUrl}/api/resume/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000, // 120 second timeout (first load needs more time)
        }
      );
      
      // Validate response structure
      if (!res.data || !res.data.scores) {
        throw new Error("Invalid response format from server");
      }
      
      console.log("API Response:", res.data); // Debug log
      setResult(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      
      let errorMessage = "An unexpected error occurred";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout - the analysis took too long. Please try again.";
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = "Cannot connect to server. Please ensure the backend is running on port 8000.";
      } else if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.detail || 
                      `Server error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        // Request made but no response
        errorMessage = "No response from server. Please check if the backend is running.";
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        onLogoClick={goHome}
        onResumeMatchClick={openAnalyzer}
        onAboutClick={openAboutPage}
        onTemplatesClick={openTemplates}
        onATSClick={openATS}
        onBatchClick={openBatch}
      />
      
      {/* Main content */}
      <div>
        <AnimatePresence mode="wait">
          {showTemplates ? (
            // Templates Page
            <TemplatesPage key="templates" />
          ) : showATS ? (
            // ATS Simulator Page
            <ATSSimulatorPage key="ats" />
          ) : showBatch ? (
            // Batch Analysis Page
            <BatchAnalysisPage key="batch" />
          ) : showAboutPage ? (
            // About Page
            <AboutPage key="about" />
          ) : !showAnalyzer && !result ? (
            // Landing Page
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onBuildResume={openAnalyzer} />
              <About />
              <BeforeAfter />
              <ResumeTips />
              <FAQ />
              <Footer />
            </motion.div>
          ) : !result ? (
            // Analyzer Page
            <motion.div
              key="analyzer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                  >
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                      Analyze Your Resume
                    </h1>
                    <p className="text-xl text-gray-600">
                      Upload your resume and job description to get comprehensive AI-powered insights
                    </p>
                  </motion.div>
                </div>
              </div>
              
              <UploadZone onUpload={handleUpload} loading={loading} />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12"
                >
                  <div className="glass-effect rounded-xl p-6 border-l-4 border-red-500">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          Analysis Error
                        </h3>
                        <p className="text-sm text-gray-700">{error}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Results Page
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsDashboard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

