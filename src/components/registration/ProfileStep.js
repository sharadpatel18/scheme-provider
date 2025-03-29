'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function ProfileStep({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.gender || formData.gender === 'Select Gender') {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.maritalStatus || formData.maritalStatus === 'Select Marital Status') {
      newErrors.maritalStatus = 'Please select your marital status';
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
      className="space-y-8 bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="mt-2 text-sm text-gray-600">Please provide your personal details to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            Date of Birth
          </label>
          <div className="mt-1">
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth || ''}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.dateOfBirth ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>

        {/* Gender Selection */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 flex items-center">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            Gender
          </label>
          <div className="mt-1">
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender || 'Select Gender'}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.gender ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="Select Gender">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>

        {/* Marital Status Selection */}
        <div>
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 flex items-center">
            <HeartIcon className="h-5 w-5 text-gray-400 mr-2" />
            Marital Status
          </label>
          <div className="mt-1">
            <select
              id="maritalStatus"
              name="maritalStatus"
              required
              value={formData.maritalStatus || 'Select Marital Status'}
              onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm ${
                errors.maritalStatus ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="Select Marital Status">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
          {errors.maritalStatus && <p className="mt-1 text-sm text-red-600">{errors.maritalStatus}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white py-2.5 px-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition duration-200"
          >
            Back
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex justify-center rounded-lg bg-blue-600 py-2.5 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition duration-200"
          >
            Continue
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
