'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepTracker from '../../components/registration/StepTracker';
import InitialStep from '../../components/registration/InitialStep';
import LoginStep from '../../components/registration/LoginStep';
import ProfileStep from '../../components/registration/ProfileStep';
import ProfileStep2 from '../../components/registration/ProfileStep2';
import { title } from 'process';
import ProfileStep3 from '@/components/registration/ProfileStep3';
import ProfileStep4 from '@/components/registration/ProfileStep4';

const steps = [
  { id: 1, title: 'Sign up' },
  { id: 2, title: 'Personal Info' },
  { id: 3, title: 'Address Info' },
  { id: 4, title: 'Documents'},
  { id: 5, title: 'Additional Info'},
  { id: 6, title: 'Complete' }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Name Info
    firstName: '',
    middleName: '',
    lastName: '',
    
    // Email
    email: '',
    
    // Password
    password: '',
    confirmPassword: '',
    
    // Profile
    profilePicture: null,
    bio: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: ''
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LoginStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <InitialStep
            step={currentStep}
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <ProfileStep2
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
        />
        );
      case 4:
        return (
          <ProfileStep3
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
        />      
        );
      case 5:
        return (
          <ProfileStep4
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />      
        );
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Complete!</h2>
            <p className="text-gray-600 mb-8">Thank you for joining us. Your account has been created successfully.</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Join us and start your journey today
            </p>
          </div>

          <StepTracker steps={steps} currentStep={currentStep} />
          
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 