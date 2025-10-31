import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentPlusIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function BatchAnalysis() {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, 10));
    }
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 10));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || jobDescription.trim().length < 50) {
      alert("Please upload at least one resume and provide a job description (minimum 50 characters)");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("resume_files", file);
      });
      formData.append("job_description", jobDescription);

      const response = await fetch("http://localhost:8000/api/batch/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportToCSV = () => {
    if (!results || !results.results) return;

    const headers = ["Rank", "Filename", "Overall Score", "Keyword Score", "Skills Count", "Word Count", "Status"];
    const rows = results.results.map((r) => [
      r.position || "-",
      r.filename,
      r.overall_score,
      r.keyword_score || "-",
      r.skills_count || "-",
      r.word_count || "-",
      r.rank || r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "batch_resume_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadgeColor = (color) => {
    const colors = {
      green: "bg-green-100 text-green-700 border-green-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
      red: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[color] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!results ? (
          <>
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <DocumentPlusIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Upload Resumes</h3>
                    <p className="text-gray-600">Upload up to 10 resumes (PDF or DOCX)</p>
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    dragActive
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                  }`}
                >
                  <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Drag and drop resume files here
                  </p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label className="cursor-pointer">
                    <span className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-block">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-4">
                    {files.length}/10 files selected
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Selected Files:</h4>
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <DocumentPlusIcon className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <XCircleIcon className="w-6 h-6" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Job Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h3>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here (minimum 50 characters)..."
                  className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {jobDescription.length} characters
                </p>
              </div>
            </motion.div>

            {/* Analyze Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || files.length === 0 || jobDescription.length < 50}
                className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing {files.length} resumes...
                  </span>
                ) : (
                  `Analyze ${files.length} Resume${files.length !== 1 ? "s" : ""}`
                )}
              </button>
            </motion.div>
          </>
        ) : (
          /* Results Section */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200"
                >
                  <ChartBarIcon className="w-10 h-10 text-purple-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">
                    {results.statistics.total_resumes}
                  </div>
                  <div className="text-sm text-gray-600">Total Resumes</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
                >
                  <TrophyIcon className="w-10 h-10 text-green-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">
                    {results.statistics.highest_score}
                  </div>
                  <div className="text-sm text-gray-600">Highest Score</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200"
                >
                  <SparklesIcon className="w-10 h-10 text-blue-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">
                    {results.statistics.average_score}
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200"
                >
                  <CheckCircleIcon className="w-10 h-10 text-orange-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">
                    {results.statistics.successful_analyses}
                  </div>
                  <div className="text-sm text-gray-600">Successful</div>
                </motion.div>
              </div>

              {/* Export Buttons */}
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Comparison Results</h3>
                <div className="flex gap-3">
                  <button
                    onClick={exportToCSV}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => setResults(null)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                  >
                    New Analysis
                  </button>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Rank</th>
                        <th className="px-6 py-4 text-left font-semibold">Resume</th>
                        <th className="px-6 py-4 text-center font-semibold">Overall Score</th>
                        <th className="px-6 py-4 text-center font-semibold">Keyword Match</th>
                        <th className="px-6 py-4 text-center font-semibold">Skills</th>
                        <th className="px-6 py-4 text-center font-semibold">Words</th>
                        <th className="px-6 py-4 text-center font-semibold">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.results.map((result, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`hover:bg-gray-50 transition-colors ${
                            result.position === 1 ? "bg-yellow-50" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            {result.position ? (
                              <div className="flex items-center gap-2">
                                {result.position === 1 && (
                                  <TrophyIcon className="w-5 h-5 text-yellow-500" />
                                )}
                                <span className="font-bold text-lg">#{result.position}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{result.filename}</div>
                            {result.status === "error" && (
                              <div className="text-xs text-red-600 mt-1">{result.error}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {result.overall_score}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-semibold text-gray-700">
                              {result.keyword_score || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-lg font-semibold text-gray-700">
                              {result.skills_count || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-sm text-gray-600">
                              {result.word_count || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {result.rank && (
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRankBadgeColor(
                                  result.rank_color
                                )}`}
                              >
                                {result.rank}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
