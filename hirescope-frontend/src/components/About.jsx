import React from "react";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  LightBulbIcon,
  ChartBarIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function About() {
  const features = [
    {
      icon: SparklesIcon,
      title: "Semantic Understanding",
      description: "Built on SentenceTransformer (all-MiniLM-L6-v2) with 384-dimensional embeddings. Uses cosine similarity with 0.7 threshold for intelligent section deduplication and 0.4 threshold for semantic validation."
    },
    {
      icon: ShieldCheckIcon,
      title: "RAG Architecture",
      description: "Retrieval-Augmented Generation engine with vector similarity search. Dynamic context retrieval combines embedding-based matching with real-time LLM inference for contextual suggestions."
    },
    {
      icon: DocumentDuplicateIcon,
      title: "Multi-Stage Pipeline",
      description: "Parse → Extract → Embed → Match → Score. Advanced text preprocessing with intelligent URL extraction, social platform detection (16 platforms), and heuristic section filtering (caps/title case validation)."
    },
    {
      icon: LightBulbIcon,
      title: "Weighted Scoring System",
      description: "Multi-dimensional evaluation: keyword overlap (TF-IDF weighted), semantic similarity, section completeness, and skill detection. Ensemble model aggregates scores for comprehensive resume analysis."
    },
    {
      icon: ChartBarIcon,
      title: "Intelligent Detection",
      description: "No hardcoded lists. LLM-based section validation with semantic embeddings compares candidate headers against learned section patterns. Context-aware content validation ensures accurate structure detection."
    },
    {
      icon: CheckCircleIcon,
      title: "FastAPI + React Stack",
      description: "Async FastAPI 2.0 backend with Pydantic schemas. React 19 frontend with Framer Motion animations. Full-stack TypeScript/Python integration with RESTful API design and real-time PDF generation."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Advanced AI/ML Architecture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Production-ready machine learning pipeline combining transformer models, semantic embeddings, and intelligent parsing. Built with FastAPI async architecture and React 19 for real-time resume-JD matching.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
