import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does semantic section detection work?",
      answer: "We use SentenceTransformer (all-MiniLM-L6-v2) to generate 384-dimensional embeddings for each candidate header. Heuristic filtering identifies potential sections (all caps/title case, 1-5 words, has content). Then, cosine similarity compares candidates against reference section embeddings with a 0.4 threshold. Sections scoring above this are validated as true resume sections."
    },
    {
      question: "What embedding model powers the matching?",
      answer: "HireScope uses SentenceTransformer's all-MiniLM-L6-v2 model, a lightweight transformer optimized for semantic similarity tasks. It generates 384-dimensional dense vectors that capture semantic meaning. This enables intelligent keyword matching beyond exact text matching - understanding that 'machine learning' and 'ML' are semantically equivalent."
    },
    {
      question: "How is cosine similarity applied?",
      answer: "Cosine similarity measures the angle between two embedding vectors. For section deduplication, we use a 0.7 threshold - sections with similarity > 0.7 are merged (e.g., 'Experience' and 'Work Experience'). For section validation, a 0.4 threshold determines if a candidate header is semantically similar to known section patterns. This eliminates hardcoded section lists."
    },
    {
      question: "What is the RAG architecture?",
      answer: "Retrieval-Augmented Generation (RAG) combines vector similarity search with LLM inference. When analyzing a resume, we retrieve relevant context using embedding similarity, then feed this to a language model for contextualized suggestions. The embedding store acts as a knowledge base, enabling dynamic, context-aware recommendations beyond static rules."
    },
    {
      question: "How are weighted scores calculated?",
      answer: "Our ensemble scoring system evaluates multiple dimensions: (1) Keyword overlap with TF-IDF weighting prioritizes rare, relevant terms. (2) Semantic similarity using embedding cosine distance. (3) Section completeness checks for required headers. (4) Skill detection matches against tech/domain-specific vocabularies. Scores are normalized and aggregated with learned weights for a final 0-100 score."
    },
    {
      question: "What makes intelligent URL extraction work?",
      answer: "Enhanced regex pattern matches URLs with/without protocols: `(?:https?://)?(?:www\\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z]{2,6}\\b`. After extraction, we normalize protocols (add https:// if missing), deduplicate with order preservation, and categorize by domain patterns. 16 social platforms are detected (GitHub, LinkedIn, Twitter, etc.) and separated from other URLs for transparency."
    },
    {
      question: "Why no hardcoded section lists?",
      answer: "Hardcoded lists fail on resume variations (e.g., 'Work Experience' vs 'Professional Background'). Our LLM-based approach uses semantic understanding: candidate headers are embedded and compared against learned section patterns. Only headers with sufficient semantic similarity (>0.4) and proper formatting (caps/title case, content validation) are accepted. This generalizes to resume formats not seen during development."
    },
    {
      question: "What is the FastAPI + React architecture?",
      answer: "Backend: FastAPI 2.0 with async/await for non-blocking I/O, Pydantic schemas for type validation, RESTful endpoints (/api/v2/analyze, /batch, /ats). Frontend: React 19 with Vite bundler, Framer Motion for animations, html2pdf.js for client-side PDF generation. Communication via fetch API with JSON payloads. Separation enables independent scaling and technology choices."
    },
    {
      question: "How does the multi-stage pipeline work?",
      answer: "1) Parse: Extract text from PDF/DOCX using pypdf2/python-docx. 2) Extract: Regex-based URL/email/phone extraction with intelligent categorization. 3) Embed: Convert text chunks to 384-d vectors using SentenceTransformer. 4) Match: Cosine similarity between resume embeddings and JD embeddings. 5) Score: Weighted ensemble of keyword, semantic, section, and skill scores. Each stage is independently testable and optimizable."
    },
    {
      question: "Can I inspect the ML model details?",
      answer: "Yes! The backend uses open-source models from HuggingFace: sentence-transformers/all-MiniLM-L6-v2 (embeddings), FastAPI for API layer, and custom scoring logic in Python. All code is available on GitHub. Model parameters, similarity thresholds, and scoring weights are configurable. You can experiment with different transformers (e.g., all-mpnet-base-v2) by modifying the embedding_store.py configuration."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Technical Deep Dive
          </h2>
          <p className="text-xl text-gray-600">
            Understanding the AI/ML architecture behind HireScope
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-6 h-6 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">Want to contribute or learn more?</p>
          <a
            href="https://github.com/ParthSharma272/HireScope"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            Explore the Source Code
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
