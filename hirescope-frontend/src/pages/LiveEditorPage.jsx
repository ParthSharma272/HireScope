import { useState } from "react";
import { motion } from "framer-motion";
import LiveEditor from "../components/LiveEditor";
import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function LiveEditorPage({ onBack }) {
  const [jobDescription, setJobDescription] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return <LiveEditor jobDescription={jobDescription} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">
              Real-Time ATS Scoring
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Live Resume <span className="gradient-text">Editor</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Type or paste your resume and watch your ATS score update in real-time.
            Get instant feedback as you improve!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-8 shadow-card"
        >
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Job Description (Optional)
            <span className="text-gray-500 font-normal ml-2">
              - Add to get targeted keyword analysis
            </span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get targeted keyword matching and relevance scoring..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-400"
          />

          <div className="mt-6 flex justify-end">
            <motion.button
              onClick={() => setShowEditor(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <DocumentTextIcon className="w-5 h-5" />
              Open Live Editor
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
        >
          {[
            { icon: "⚡", label: "Instant Feedback", desc: "See scores update as you type" },
            { icon: "🎯", label: "Keyword Tracking", desc: "Real-time matched/missing keywords" },
            { icon: "📊", label: "Live Metrics", desc: "5 scoring dimensions updating live" },
          ].map((feature) => (
            <div key={feature.label} className="glass-effect rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="font-semibold text-gray-900 mb-1">{feature.label}</div>
              <div className="text-xs text-gray-600">{feature.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
