'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IdentificationIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export default function ProfileStep3({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.aadhaarNumber) {
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Please enter a valid 12-digit Aadhaar number';
    }

    if (!formData.panNumber) {
      newErrors.panNumber = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN number';
    }

    if (!formData.education || formData.education === 'Select Education') {
      newErrors.education = 'Please select your education';
    }

    if (!formData.occupation || formData.occupation === 'Select Occupation') {
      newErrors.occupation = 'Please select your occupation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const educationOptions = [
    'Select Education',
    'high-school',
    'undergraduate',
    'graduate',
    'post-graduate'
  ];

  const occupationOptions = [
    'Select Occupation',
    'student',
    'employed',
    'self-employed',
    'unemployed'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Identity Information
        </h2>
        <p className="text-lg text-gray-600">
          Please provide your identity and professional details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <IdentificationIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="aadhaarNumber" className="block text-xl font-semibold text-gray-900">
                Aadhaar Number
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="aadhaarNumber"
                name="aadhaarNumber"
                required
                value={formData.aadhaarNumber || ''}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                className={`block w-full pl-4 pr-12 py-3.5 text-base border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.aadhaarNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="123456789012"
                maxLength={12}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.aadhaarNumber && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.aadhaarNumber}
              </motion.p>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <IdentificationIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="panNumber" className="block text-xl font-semibold text-gray-900">
                PAN Number
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="panNumber"
                name="panNumber"
                required
                value={formData.panNumber || ''}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                className={`block w-full pl-4 pr-12 py-3.5 text-base border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.panNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.panNumber && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.panNumber}
              </motion.p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="education" className="block text-xl font-semibold text-gray-900">
                Education
              </label>
            </div>
            <div className="relative">
              <select
                id="education"
                name="education"
                required
                value={formData.education || 'Select Education'}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className={`block w-full pl-4 pr-12 py-3.5 text-base border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.education ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {educationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Select Education' ? option : option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <AcademicCapIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.education && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.education}
              </motion.p>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BriefcaseIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="occupation" className="block text-xl font-semibold text-gray-900">
                Occupation
              </label>
            </div>
            <div className="relative">
              <select
                id="occupation"
                name="occupation"
                required
                value={formData.occupation || 'Select Occupation'}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className={`block w-full pl-4 pr-12 py-3.5 text-base border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.occupation ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {occupationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Select Occupation' ? option : option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.occupation && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.occupation}
              </motion.p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-3.5 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Continue
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
