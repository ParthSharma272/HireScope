import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is HireScope really free?",
      answer: "Yes, absolutely! Your first resume analysis is 100% free forever. You can analyze your resume, download the report, and get comprehensive insights without paying a cent. No hidden fees, no credit card required, no watermarks."
    },
    {
      question: "How does the ATS scoring work?",
      answer: "Our ATS (Applicant Tracking System) scoring analyzes your resume the same way employer software does. We check for keyword matches, formatting compatibility, section organization, and readability. You'll get a score out of 100 and specific recommendations on what to improve."
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF and DOCX (Microsoft Word) file formats. These are the most common resume formats and ensure the best parsing accuracy. Simply upload your file and we'll extract the text for analysis."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We take data security seriously. Your resume data is never sold to third parties. We're GDPR-compliant and you can delete your data anytime. All data transmission is encrypted, and we don't store your resume longer than necessary."
    },
    {
      question: "How accurate is the keyword matching?",
      answer: "Our keyword matching uses advanced NLP (Natural Language Processing) and semantic analysis. We don't just look for exact word matches - we understand synonyms and related concepts. For example, we know that 'machine learning' relates to 'ML', 'AI', and 'predictive modeling'."
    },
    {
      question: "Can I analyze multiple resumes?",
      answer: "Yes! You can analyze your resume multiple times with different job descriptions. This is perfect for tailoring your resume to specific roles or comparing different versions to see which performs better."
    },
    {
      question: "What makes HireScope different from other resume analyzers?",
      answer: "HireScope combines multiple analysis methods: structural scoring, keyword matching, semantic relevance using AI embeddings, readability analysis, and tone assessment. We also provide weighted keyword matching that prioritizes critical skills, competitive analysis, and actionable recommendations - not just a score."
    },
    {
      question: "Do you provide resume writing or editing services?",
      answer: "HireScope is an analysis tool, not a writing service. We provide detailed insights and recommendations on what to improve, but you make the changes yourself. This approach empowers you to learn what makes a great resume and apply those principles to future applications."
    },
    {
      question: "How long does the analysis take?",
      answer: "Most analyses complete in 10-30 seconds, depending on the length of your resume and job description. Our system uses advanced caching and lazy loading to ensure fast processing times."
    },
    {
      question: "Can I share my results?",
      answer: "Yes! After your analysis completes, you can download a comprehensive HTML report, share your score via WhatsApp or email, and even save it for later comparison. This makes it easy to track your progress or get feedback from mentors."
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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about HireScope
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
          <p className="text-gray-600 mb-6">Still have questions?</p>
          <a
            href="https://github.com/ParthSharma272/HireScope/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            Ask on GitHub
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
