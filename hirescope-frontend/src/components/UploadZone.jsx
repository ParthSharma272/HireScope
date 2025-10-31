import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function UploadZone({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && jobDescription.trim()) {
      onUpload(file, jobDescription);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="glass-effect rounded-2xl p-8 shadow-card">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Upload Your Resume
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
              dragActive
                ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]"
                : file
                ? "border-green-400 bg-green-50/30"
                : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={loading}
            />

            {!file ? (
              <div className="text-center">
                <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Drag & drop your resume here
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  or click to browse
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  PDF or DOCX • Max 10MB
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DocumentTextIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {file.name}
                      </p>
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB • {file.type.includes('pdf') ? 'PDF' : 'DOCX'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={loading}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="glass-effect rounded-2xl p-8 shadow-card">
          <label
            htmlFor="jobDescription"
            className="block text-sm font-semibold text-gray-900 mb-4"
          >
            Job Description
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here... Include requirements, qualifications, and key skills."
            rows={8}
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-400 ${
              jobDescription.trim()
                ? "border-green-400 bg-green-50/20"
                : "border-gray-200"
            }`}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {jobDescription.trim().length > 0
                ? `${jobDescription.trim().split(/\s+/).length} words`
                : "Min. 50 characters recommended"}
            </span>
            {jobDescription.trim().length > 0 && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Ready
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            type="submit"
            disabled={!file || !jobDescription.trim() || loading}
            whileHover={!file || !jobDescription.trim() || loading ? {} : { scale: 1.02 }}
            whileTap={!file || !jobDescription.trim() || loading ? {} : { scale: 0.98 }}
            className={`
              px-8 py-4 font-semibold rounded-xl shadow-lg 
              transition-all flex items-center gap-2
              ${
                !file || !jobDescription.trim() || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:from-indigo-700 hover:to-purple-700"
              }
            `}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-5 h-5" />
                Analyze Resume
              </>
            )}
          </motion.button>
          
          {/* Helper text */}
          {(!file || !jobDescription.trim()) && !loading && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-500 text-center"
            >
              {!file && !jobDescription.trim()
                ? "Please upload a resume and add a job description"
                : !file
                ? "Please upload a resume to continue"
                : "Please add a job description to continue"}
            </motion.p>
          )}
        </div>
      </form>
    </motion.div>
  );
}
