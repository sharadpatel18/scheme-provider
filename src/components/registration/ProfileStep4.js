'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, UserIcon, DocumentTextIcon, AcademicCapIcon, BriefcaseIcon, UserGroupIcon, HeartIcon, LanguageIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function ProfileStep4({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isLocalStorageSaved, setIsLocalStorageSaved] = useState(false);

  useEffect(() => {
    // Check if data exists in localStorage
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setIsLocalStorageSaved(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category || formData.category === 'Select Category') {
      newErrors.category = 'Please select a category';
    }

    if (!formData.disability || formData.disability === 'Select Option') {
      newErrors.disability = 'Please select an option';
    }

    if (formData.disability === 'yes') {
      if (!formData.disabilityType?.trim()) {
        newErrors.disabilityType = 'Please specify your disability type';
      }
      
      if (!formData.disabilityPercentage) {
        newErrors.disabilityPercentage = 'Please enter disability percentage';
      } else {
        const percentage = Number(formData.disabilityPercentage);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
          newErrors.disabilityPercentage = 'Percentage must be between 0 and 100';
        }
      }
    }

    if (!formData.preferredLanguage || formData.preferredLanguage === 'Select Language') {
      newErrors.preferredLanguage = 'Please select your preferred language';
    }

    if (!formData.communicationMode || formData.communicationMode === 'Select Mode') {
      newErrors.communicationMode = 'Please select your preferred communication mode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('profileData', JSON.stringify(formData));
      setIsLocalStorageSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };

  const submitToBackend = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError('');

      // Log the form data being sent
      console.log('Submitting form data:', formData);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);
      if(responseData.success){
        localStorage.setItem('profileData', JSON.stringify(formData));
        localStorage.setItem('token', responseData.token);
      }

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to submit profile');
      }

      return true;
    } catch (error) {
      console.error('Error submitting profile:', error);
      setSubmitError(error.message || 'Failed to submit profile. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // First save to localStorage
      const localStorageSuccess = saveToLocalStorage();
      if (!localStorageSuccess) {
        throw new Error('Failed to save data locally');
      }

      // Then submit to backend
      const backendSuccess = await submitToBackend();
      if (!backendSuccess) {
        throw new Error('Failed to submit to backend');
      }

      // If both succeed, proceed to next step
      onNext();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An error occurred. Please try again.');
    }
  };

  const categoryOptions = [
    'Select Category',
    'general',
    'sc',
    'st',
    'obc'
  ];

  const disabilityOptions = [
    'Select Option',
    'no',
    'yes'
  ];

  const languageOptions = [
    'Select Language',
    'English',
    'Hindi',
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi'
  ];

  const communicationOptions = [
    'Select Mode',
    'email',
    'sms',
    'both'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Additional Information</h2>
        <p className="text-lg text-gray-600">
          Please provide some additional details to complete your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Category Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <UserGroupIcon className="h-6 w-6 text-blue-500" />
              <label htmlFor="category" className="block text-lg font-semibold text-gray-900">
                Category
              </label>
            </div>
            <div className="relative">
              <select
                id="category"
                name="category"
                required
                value={formData.category || 'Select Category'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`block w-full pl-4 pr-10 py-3 text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isSubmitting}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Select Category' ? option : option.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.category}
              </p>
            )}
          </div>

          {/* Disability Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <HeartIcon className="h-6 w-6 text-blue-500" />
              <label htmlFor="disability" className="block text-lg font-semibold text-gray-900">
                Disability Information
              </label>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <select
                  id="disability"
                  name="disability"
                  required
                  value={formData.disability || 'Select Option'}
                  onChange={(e) => setFormData({ ...formData, disability: e.target.value })}
                  className={`block w-full pl-4 pr-10 py-3 text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.disability ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                >
                  {disabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'Select Option' ? option : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {formData.disability === 'yes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="disabilityType" className="block text-sm font-medium text-gray-700 mb-1">
                      Type of Disability
                    </label>
                    <input
                      type="text"
                      id="disabilityType"
                      name="disabilityType"
                      required
                      value={formData.disabilityType || ''}
                      onChange={(e) => setFormData({ ...formData, disabilityType: e.target.value })}
                      className={`block w-full px-4 py-3 text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.disabilityType ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      disabled={isSubmitting}
                      placeholder="Specify disability type"
                    />
                    {errors.disabilityType && (
                      <p className="mt-2 text-sm text-red-600">{errors.disabilityType}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="disabilityPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                      Disability Percentage
                    </label>
                    <input
                      type="number"
                      id="disabilityPercentage"
                      name="disabilityPercentage"
                      required
                      min="0"
                      max="100"
                      value={formData.disabilityPercentage || ''}
                      onChange={(e) => setFormData({ ...formData, disabilityPercentage: e.target.value })}
                      className={`block w-full px-4 py-3 text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.disabilityPercentage ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      disabled={isSubmitting}
                      placeholder="Enter percentage (0-100)"
                    />
                    {errors.disabilityPercentage && (
                      <p className="mt-2 text-sm text-red-600">{errors.disabilityPercentage}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Language and Communication Preferences */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <LanguageIcon className="h-6 w-6 text-blue-500" />
              <label htmlFor="preferredLanguage" className="block text-lg font-semibold text-gray-900">
                Language & Communication
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Language
                </label>
                <div className="relative">
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    required
                    value={formData.preferredLanguage || 'Select Language'}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    className={`block w-full pl-4 pr-10 py-3 text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.preferredLanguage ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={isSubmitting}
                  >
                    {languageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.preferredLanguage && (
                  <p className="mt-2 text-sm text-red-600">{errors.preferredLanguage}</p>
                )}
              </div>

              <div>
                <label htmlFor="communicationMode" className="block text-sm font-medium text-gray-700 mb-1">
                  Communication Mode
                </label>
                <div className="relative">
                  <select
                    id="communicationMode"
                    name="communicationMode"
                    required
                    value={formData.communicationMode || 'Select Mode'}
                    onChange={(e) => setFormData({ ...formData, communicationMode: e.target.value })}
                    className={`block w-full pl-4 pr-10 py-3 text-base border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.communicationMode ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={isSubmitting}
                  >
                    {communicationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === 'Select Mode' ? option : option === 'sms' ? 'SMS' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.communicationMode && (
                  <p className="mt-2 text-sm text-red-600">{errors.communicationMode}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={isSubmitting}
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
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white ${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Complete Registration
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
