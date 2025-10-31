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
      title: "Free forever",
      description: "Your first resume analysis is 100% free forever. No strings attached. No hidden fees, no watermarks. Download it as a high-quality report whenever you need."
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure your data",
      description: "We never sell your data. Period. We're GDPR-compliant, and you can delete your data anytime you want. Your data, your control."
    },
    {
      icon: DocumentDuplicateIcon,
      title: "Multiple analyses",
      description: "Analyze your resume for different jobs, regions, or industries with just a click. Test different versions and see what works best."
    },
    {
      icon: LightBulbIcon,
      title: "Expert advice at your fingertips",
      description: "Benefit from valuable AI-powered insights while you optimize. Our comprehensive scoring system helps you understand exactly what to improve."
    },
    {
      icon: ChartBarIcon,
      title: "ATS-ready Resume",
      description: "Many employers use scanners to spot keywords in resumes. With HireScope, your analysis is ready for scanners to read and optimized for success."
    },
    {
      icon: CheckCircleIcon,
      title: "Keyword optimization",
      description: "Get detailed keyword matching against job descriptions. See exactly which skills you're highlighting and which ones you're missing."
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
            Everything you need, made simple
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No hidden fees, no watermarks, no surprises. Your data stays private, your first analysis is free forever, and you can analyze, edit, and improve it anytime.
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
