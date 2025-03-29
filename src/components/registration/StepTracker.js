'use client';

import { motion } from 'framer-motion';

export default function StepTracker({ steps, currentStep }) {
  return (
    <div className="relative">
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
        <motion.div
          className="absolute h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index + 1 <= currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-500'
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  borderColor: isActive ? '#2563eb' : '#d1d5db'
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </motion.div>
              <motion.span
                className={`mt-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
                initial={false}
                animate={{
                  color: isActive ? '#2563eb' : '#6b7280'
                }}
                transition={{ duration: 0.2 }}
              >
                {step.title}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 