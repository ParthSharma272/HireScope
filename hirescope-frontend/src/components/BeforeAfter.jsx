import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function BeforeAfter() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [direction, setDirection] = useState(0);

  const examples = [
    {
      role: "Software Engineer",
      before: {
        score: 42,
        text: "Worked on various projects using Java and Python. Responsible for coding and testing.",
        issues: [
          "Vague responsibilities",
          "No metrics or achievements",
          "Weak action verbs",
          "Missing technical keywords"
        ]
      },
      after: {
        score: 87,
        text: "Architected and deployed 5 microservices using Java Spring Boot, reducing API response time by 40%. Led test automation initiative with Python/Selenium, increasing code coverage from 45% to 92%.",
        improvements: [
          "Specific technologies mentioned",
          "Quantified achievements (40%, 92%)",
          "Strong action verbs (Architected, Led)",
          "Clear business impact"
        ]
      },
      testimonial: {
        name: "Sarah Chen",
        title: "Software Engineer at Google",
        quote: "After using HireScope, I rewrote my resume and got 3x more interview callbacks. The specific suggestions were game-changing!"
      }
    },
    {
      role: "Product Manager",
      before: {
        score: 38,
        text: "Managed product development. Worked with teams to deliver features on time.",
        issues: [
          "Generic statements",
          "No product metrics",
          "Missing stakeholder management",
          "No strategic impact shown"
        ]
      },
      after: {
        score: 91,
        text: "Led cross-functional team of 12 to launch B2B SaaS product, generating $2M ARR in first year. Conducted 50+ user interviews to define product roadmap, resulting in 25% increase in user retention.",
        improvements: [
          "Team size quantified (12 people)",
          "Revenue impact ($2M ARR)",
          "User research emphasized (50+ interviews)",
          "Retention metrics (25% increase)"
        ]
      },
      testimonial: {
        name: "Michael Torres",
        title: "PM at Microsoft",
        quote: "HireScope showed me exactly what recruiters look for. I landed my dream job within 2 weeks of updating my resume!"
      }
    },
    {
      role: "Marketing Manager",
      before: {
        score: 45,
        text: "Managed social media accounts and email campaigns. Helped grow the company's online presence.",
        issues: [
          "No specific channels/platforms",
          "Missing growth metrics",
          "Vague 'helped grow' statement",
          "No campaign details"
        ]
      },
      after: {
        score: 89,
        text: "Orchestrated multi-channel marketing strategy across LinkedIn, Twitter, and email, growing qualified leads by 180% (5K to 14K). Optimized email campaigns with A/B testing, improving conversion rate from 2.1% to 4.8%.",
        improvements: [
          "Specific platforms listed",
          "Impressive growth numbers (180%)",
          "Technical skills (A/B testing)",
          "Conversion metrics (2.1% to 4.8%)"
        ]
      },
      testimonial: {
        name: "Emily Roberts",
        title: "Marketing Director at HubSpot",
        quote: "The before/after comparisons opened my eyes. My resume went from bland to brilliant in one afternoon!"
      }
    }
  ];

  const reviews = [
    {
      name: "Sarah Chen",
      title: "Software Engineer at Google",
      image: "S",
      quote: "After using HireScope, I rewrote my resume and got 3x more interview callbacks. The specific suggestions were game-changing!",
      rating: 5,
      color: "from-purple-600 to-blue-600"
    },
    {
      name: "Michael Torres",
      title: "PM at Microsoft",
      image: "M",
      quote: "HireScope showed me exactly what recruiters look for. I landed my dream job within 2 weeks of updating my resume!",
      rating: 5,
      color: "from-blue-600 to-cyan-600"
    },
    {
      name: "Emily Roberts",
      title: "Marketing Director at HubSpot",
      image: "E",
      quote: "The before/after comparisons opened my eyes. My resume went from bland to brilliant in one afternoon!",
      rating: 5,
      color: "from-pink-600 to-purple-600"
    },
    {
      name: "David Kim",
      title: "Data Scientist at Amazon",
      image: "D",
      quote: "The AI suggestions were spot-on. My technical skills are now properly highlighted, and I've received multiple offers!",
      rating: 5,
      color: "from-green-600 to-emerald-600"
    },
    {
      name: "Priya Sharma",
      title: "UX Designer at Adobe",
      image: "P",
      quote: "As a designer, I appreciate good UX. HireScope's interface is intuitive, and the results are phenomenal. Highly recommend!",
      rating: 5,
      color: "from-orange-600 to-red-600"
    },
    {
      name: "James Wilson",
      title: "Financial Analyst at Goldman Sachs",
      image: "J",
      quote: "The quantitative focus in my resume improved dramatically. HireScope helped me showcase my financial modeling skills perfectly.",
      rating: 5,
      color: "from-indigo-600 to-purple-600"
    },
    {
      name: "Lisa Anderson",
      title: "HR Manager at Salesforce",
      image: "L",
      quote: "I review hundreds of resumes monthly. HireScope teaches job seekers what we actually look for. It's a game-changer!",
      rating: 5,
      color: "from-cyan-600 to-blue-600"
    },
    {
      name: "Alex Martinez",
      title: "DevOps Engineer at Netflix",
      image: "A",
      quote: "The ATS optimization feature is incredible. My resume now passes automated systems and reaches hiring managers!",
      rating: 5,
      color: "from-red-600 to-pink-600"
    }
  ];

  const nextReview = () => {
    setDirection(1);
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setDirection(-1);
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          See The <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Transformation</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real resume improvements from HireScope users. See how small changes create massive impact.
        </p>
      </motion.div>

      {/* Role Selector */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {examples.map((example, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === idx
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {example.role}
          </button>
        ))}
      </div>

      {/* Before/After Comparison */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* BEFORE */}
          <div className="glass-effect rounded-2xl p-8 shadow-card border-2 border-red-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <XCircleIcon className="w-7 h-7 text-red-600" />
                Before
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-red-600">{examples[activeTab].before.score}</span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-4 border-l-4 border-red-500">
              <p className="text-gray-700 leading-relaxed">{examples[activeTab].before.text}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">❌ Issues Found:</h4>
              <ul className="space-y-2">
                {examples[activeTab].before.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-500 mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AFTER */}
          <div className="glass-effect rounded-2xl p-8 shadow-card border-2 border-green-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircleIcon className="w-7 h-7 text-green-600" />
                After HireScope
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-green-600">{examples[activeTab].after.score}</span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-4 border-l-4 border-green-500">
              <p className="text-gray-700 leading-relaxed">{examples[activeTab].after.text}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">✅ Improvements:</h4>
              <ul className="space-y-2">
                {examples[activeTab].after.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Score Improvement Badge */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        className="flex justify-center mb-12"
      >
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-8 py-4 inline-flex items-center gap-3">
          <span className="text-4xl">🚀</span>
          <div>
            <div className="text-3xl font-bold text-green-700">
              +{examples[activeTab].after.score - examples[activeTab].before.score} Points
            </div>
            <div className="text-sm text-gray-600">Average Score Improvement</div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Slider */}
      <div className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            What Our Users Say
          </h3>
          <p className="text-gray-600">Join thousands of job seekers who transformed their careers</p>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-12">
          {/* Slider Navigation */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next review"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>

          {/* Review Cards - Show 3 at once */}
          <div className="overflow-hidden py-8">
            <div className="flex items-center justify-center gap-6">
              {/* Previous Review (Left) */}
              <motion.div
                key={`left-${currentReview}`}
                initial={{ opacity: 0, scale: 0.85, x: direction === 1 ? -50 : 50 }}
                animate={{ opacity: 0.5, scale: 0.85, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex-shrink-0 w-80 cursor-pointer"
                onClick={prevReview}
              >
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${reviews[(currentReview - 1 + reviews.length) % reviews.length].color} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                      {reviews[(currentReview - 1 + reviews.length) % reviews.length].image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 italic line-clamp-3 mb-3">
                        "{reviews[(currentReview - 1 + reviews.length) % reviews.length].quote}"
                      </p>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{reviews[(currentReview - 1 + reviews.length) % reviews.length].name}</p>
                        <p className="text-xs text-gray-600 truncate">{reviews[(currentReview - 1 + reviews.length) % reviews.length].title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Current Review (Center - Featured) */}
              <motion.div
                key={`center-${currentReview}`}
                initial={{ opacity: 0, scale: 0.9, x: direction * 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex-shrink-0 w-[500px] z-10"
              >
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200">
                  <div className="flex items-start gap-6">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${reviews[currentReview].color} flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg`}>
                      {reviews[currentReview].image}
                    </div>
                    <div className="flex-1">
                      {/* Star Rating */}
                      <div className="flex gap-1 mb-3">
                        {[...Array(reviews[currentReview].rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xl text-gray-700 italic mb-4 leading-relaxed">
                        "{reviews[currentReview].quote}"
                      </p>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{reviews[currentReview].name}</p>
                        <p className="text-gray-600">{reviews[currentReview].title}</p>
                      </div>
                    </div>
                    <div className="text-7xl text-purple-200 leading-none select-none">"</div>
                  </div>
                </div>
              </motion.div>

              {/* Next Review (Right) */}
              <motion.div
                key={`right-${currentReview}`}
                initial={{ opacity: 0, scale: 0.85, x: direction === 1 ? 50 : -50 }}
                animate={{ opacity: 0.5, scale: 0.85, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex-shrink-0 w-80 cursor-pointer"
                onClick={nextReview}
              >
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${reviews[(currentReview + 1) % reviews.length].color} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                      {reviews[(currentReview + 1) % reviews.length].image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 italic line-clamp-3 mb-3">
                        "{reviews[(currentReview + 1) % reviews.length].quote}"
                      </p>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{reviews[(currentReview + 1) % reviews.length].name}</p>
                        <p className="text-xs text-gray-600 truncate">{reviews[(currentReview + 1) % reviews.length].title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentReview ? 1 : -1);
                  setCurrentReview(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentReview === idx
                    ? "bg-purple-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <p className="text-gray-600 mb-6">Ready to transform your resume like these professionals?</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Try HireScope Free
        </button>
      </motion.div>
    </div>
  );
}
