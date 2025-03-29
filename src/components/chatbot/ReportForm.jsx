"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaFileAlt, FaCamera, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';

const ReportForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    location: '',
    attachments: [],
    priority: 'medium'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Infrastructure',
    'Public Services',
    'Law and Order',
    'Healthcare',
    'Education',
    'Sanitation',
    'Transportation',
    'Others'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Close after showing success message
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-24 right-6 w-96 bg-white rounded-3xl shadow-2xl overflow-hidden z-50 border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FaFileAlt className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-semibold leading-none mb-1">Submit Report</h3>
              <p className="text-green-100 text-xs">File a complaint or report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border-0 bg-gray-50 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              placeholder="Brief subject of the report"
              className="w-full px-4 py-2 rounded-xl border-0 bg-gray-50 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Detailed description of the issue..."
              rows={4}
              className="w-full px-4 py-2 rounded-xl border-0 bg-gray-50 focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter location details"
                className="w-full px-4 py-2 pl-10 rounded-xl border-0 bg-gray-50 focus:ring-2 focus:ring-green-500"
              />
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <div className="flex gap-4">
              {['low', 'medium', 'high'].map((priority) => (
                <label key={priority} className="flex items-center">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium capitalize cursor-pointer transition-all
                    ${formData.priority === priority
                      ? priority === 'low' ? 'bg-blue-100 text-blue-700'
                        : priority === 'medium' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <div className="space-y-2">
              <label className="block">
                <span className="sr-only">Choose files</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer flex items-center justify-center gap-2 bg-gray-50">
                  <FaCamera className="text-gray-400" />
                  <span className="text-sm text-gray-600">Add photos or documents</span>
                </div>
              </label>
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Report</span>
            )}
          </button>
        </form>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Report Submitted!</h3>
              <p className="text-gray-600 text-sm mt-1">Thank you for your report</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportForm; 