'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export default function InitialStep({ formData, setFormData, onNext }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select your gender';

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
          Personal Information
        </h2>
        <p className="text-lg text-gray-600">
          Please provide your basic details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 space-y-6">
          <div className="space-y-6">
            {/* Full Name Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UserIcon className="h-6 w-6 text-blue-500" />
                </div>
                <label className="block text-xl font-semibold text-gray-900">
                  Full Name
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                      errors.firstName ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName || ''}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter middle name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                      errors.lastName ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Date of Birth Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UserIcon className="h-6 w-6 text-blue-500" />
                </div>
                <label htmlFor="dob" className="block text-xl font-semibold text-gray-900">
                  Date of Birth
                </label>
              </div>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                  errors.dob ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.dob && (
                <p className="mt-2 text-sm text-red-600">{errors.dob}</p>
              )}
            </div>

            {/* Gender Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UserIcon className="h-6 w-6 text-blue-500" />
                </div>
                <label htmlFor="gender" className="block text-xl font-semibold text-gray-900">
                  Gender
                </label>
              </div>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender || ''}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                  errors.gender ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
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