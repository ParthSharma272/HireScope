import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  SparklesIcon,
  BriefcaseIcon,
  BeakerIcon,
  ChartBarIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

const templates = [
  {
    id: 'tech',
    name: 'Technology & Software',
    icon: SparklesIcon,
    description: 'Perfect for Software Engineers, Developers, and Tech roles',
    color: 'purple',
    features: [
      'Technical skills section',
      'Project highlights',
      'GitHub/Portfolio links',
      'Action-oriented achievements'
    ],
    preview: {
      sections: ['Summary', 'Technical Skills', 'Experience', 'Projects', 'Education'],
      sampleBullet: '• Developed microservices architecture reducing latency by 40% for 2M+ users'
    }
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    icon: ChartBarIcon,
    description: 'Ideal for Financial Analysts, Accountants, and Banking roles',
    color: 'blue',
    features: [
      'Quantitative achievements',
      'Certifications (CPA, CFA)',
      'Financial modeling skills',
      'Compliance expertise'
    ],
    preview: {
      sections: ['Professional Summary', 'Core Competencies', 'Experience', 'Certifications', 'Education'],
      sampleBullet: '• Managed $50M portfolio with 18% YoY returns, exceeding benchmark by 6%'
    }
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    icon: BeakerIcon,
    description: 'Designed for Nurses, Doctors, Healthcare Administrators',
    color: 'green',
    features: [
      'Clinical experience',
      'Certifications & licenses',
      'Patient care metrics',
      'HIPAA compliance'
    ],
    preview: {
      sections: ['Licensure & Certifications', 'Clinical Experience', 'Skills', 'Education'],
      sampleBullet: '• Improved patient satisfaction scores by 25% while maintaining 98% adherence rate'
    }
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    icon: MegaphoneIcon,
    description: 'Optimized for Marketing Managers, Sales Reps, Digital Marketers',
    color: 'pink',
    features: [
      'Campaign results',
      'ROI & conversion metrics',
      'Digital marketing tools',
      'Brand building achievements'
    ],
    preview: {
      sections: ['Summary', 'Key Achievements', 'Experience', 'Skills & Tools', 'Education'],
      sampleBullet: '• Led campaign generating $2.5M revenue with 320% ROI and 45% conversion rate'
    }
  }
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = (template) => {
    // For now, show alert. In production, this would generate and download DOCX
    alert(`Downloading ${template.name} template...\n\nThis would download an ATS-optimized DOCX file with:\n• Pre-formatted sections\n• Example bullet points\n• Placeholder text to customize\n• Professional styling`);
  };

  const getColorClasses = (color) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
    };
    return colors[color] || colors.purple;
  };

  const getIconBgColor = (color) => {
    const colors = {
      purple: 'bg-purple-100',
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      pink: 'bg-pink-100'
    };
    return colors[color] || colors.purple;
  };

  const getIconColor = (color) => {
    const colors = {
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      pink: 'text-pink-600'
    };
    return colors[color] || colors.purple;
  };

  return (
    <section id="templates" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Industry-Specific Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with a professionally designed, ATS-optimized template tailored to your industry
            </p>
          </motion.div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-8">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${getIconBgColor(template.color)}`}>
                      <Icon className={`w-8 h-8 ${getIconColor(template.color)}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {template.name}
                      </h3>
                      <p className="text-gray-600">{template.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">INCLUDES:</h4>
                    <div className="space-y-2">
                      {template.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircleIcon className={`w-5 h-5 ${getIconColor(template.color)}`} />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-xs font-semibold text-gray-500 mb-2">SECTIONS:</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {template.preview.sections.map((section, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 border border-gray-200"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 mb-2">SAMPLE BULLET:</div>
                    <p className="text-sm text-gray-700 italic">{template.preview.sampleBullet}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowPreview(true);
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(template)}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r ${getColorClasses(template.color)} text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105`}
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
        >
          <BriefcaseIcon className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">100% Free Forever</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            All templates are completely free. Download as many as you need and customize them for each application.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span>ATS-Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span>Professional Design</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span>Easy to Customize</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span>DOCX Format</span>
            </div>
          </div>
        </motion.div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedTemplate.name}
                      </h3>
                      <p className="text-gray-600">{selectedTemplate.description}</p>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Preview Content */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-gray-200">
                    <div className="space-y-4">
                      <div className="text-center border-b pb-4">
                        <h4 className="text-xl font-bold text-gray-900">YOUR NAME</h4>
                        <p className="text-sm text-gray-600">City, State | email@example.com | (123) 456-7890</p>
                      </div>
                      
                      {selectedTemplate.preview.sections.map((section, idx) => (
                        <div key={idx} className="border-b pb-3">
                          <h5 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            {section}
                          </h5>
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-300 rounded w-full"></div>
                            <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-2 bg-gray-300 rounded w-4/6"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => {
                      handleDownload(selectedTemplate);
                      setShowPreview(false);
                    }}
                    className={`w-full px-6 py-4 bg-gradient-to-r ${getColorClasses(selectedTemplate.color)} text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105`}
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download {selectedTemplate.name} Template
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
