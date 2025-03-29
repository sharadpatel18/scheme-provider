'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfileStep2({ formData, setFormData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.addressLine1?.trim()) {
      newErrors.addressLine1 = 'Address Line 1 is required';
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state || formData.state === 'Select State') {
      newErrors.state = 'Please select your state';
    }

    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
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

  const stateOptions = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="addressLine1" className="block text-base font-medium text-gray-700 mb-2">
            Address Line 1
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            required
            value={formData.addressLine1 || ''}
            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm 
              ${errors.addressLine1 
                ? 'border-red-500 bg-red-50 focus:ring-red-400' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            placeholder="Street address or P.O. box"
          />
          {errors.addressLine1 && <p className="mt-2 text-sm text-red-600">{errors.addressLine1}</p>}
        </div>

        <div>
          <label htmlFor="addressLine2" className="block text-base font-medium text-gray-700 mb-2">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2 || ''}
            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            className="block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Apartment, suite, unit, building, floor, etc."
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-base font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm 
              ${errors.city 
                ? 'border-red-500 bg-red-50 focus:ring-red-400' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            placeholder="Enter your city"
          />
          {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-base font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            id="state"
            name="state"
            required
            value={formData.state || 'Select State'}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm 
              ${errors.state 
                ? 'border-red-500 bg-red-50 focus:ring-red-400' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
          >
            <option value="Select State">Select State</option>
            {stateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state}</p>}
        </div>

        <div>
          <label htmlFor="pincode" className="block text-base font-medium text-gray-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            required
            value={formData.pincode || ''}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className={`block w-full px-4 py-2 border rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 sm:text-sm 
              ${errors.pincode 
                ? 'border-red-500 bg-red-50 focus:ring-red-400' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            placeholder="123456"
            maxLength={6}
          />
          {errors.pincode && <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>}
        </div>

        <div className="flex justify-between pt-4">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Back
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Continue
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
