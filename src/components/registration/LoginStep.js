'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginStep({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Login Information
        </h2>
        <p className="text-lg text-gray-600">Enter your credentials to continue.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 space-y-6">
          {/* Email Field */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <EnvelopeIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="email" className="block text-xl font-semibold text-gray-900">
                Email Address
              </label>
            </div>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.email ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Number Field */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <PhoneIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="phoneNumber" className="block text-xl font-semibold text-gray-900">
                Phone Number
              </label>
            </div>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              maxLength={10}
              value={formData.phoneNumber || ''}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.phoneNumber ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phoneNumber && <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <LockClosedIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="password" className="block text-xl font-semibold text-gray-900">
                Password
              </label>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.password ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Create a strong password"
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            <p className="mt-2 text-sm text-gray-500">Must be at least 6 characters long</p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <LockClosedIcon className="h-6 w-6 text-blue-500" />
              </div>
              <label htmlFor="confirmPassword" className="block text-xl font-semibold text-gray-900">
                Confirm Password
              </label>
            </div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword || ''}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.confirmPassword ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
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
        </div>
      </form>
    </motion.div>
  );
}
