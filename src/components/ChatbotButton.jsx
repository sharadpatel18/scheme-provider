"use client";

import React, { useContext, useState } from 'react';
import { FaRobot, FaComments, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWithAI from './chatbot/ChatWithAI';
import EmergencyChatbot from './chatbot/EmergencyChatbot';
import ReportForm from './chatbot/ReportForm';
import Image from 'next/image';
import { SchemeContext } from '@/context/SchemeProvider';

const ChatbotButton = () => {
  const { isOpen , setIsOpen} = useContext(SchemeContext)
  // const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEmergencyChat, setShowEmergencyChat] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const options = [
    { 
      id: 1, 
      text: 'Chat with Sharthi', 
      icon: FaComments, 
      color: 'from-blue-600 to-blue-400',
      description: 'Get instant help and support'
    },
    { 
      id: 2, 
      text: 'Emergency', 
      icon: FaExclamationTriangle, 
      color: 'from-red-600 to-red-400',
      description: 'Quick access to emergency services'
    },
    { 
      id: 3, 
      text: 'Report and FIR', 
      icon: FaFileAlt, 
      color: 'from-green-600 to-green-400',
      description: 'File reports and complaints'
    }
  ];

  const handleOptionClick = (optionId) => {
    if (optionId === 1) {
      setShowChat(true);
    } else if (optionId === 2) {
      setShowEmergencyChat(true);
    } else if (optionId === 3) {
      setShowReportForm(true);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute right-0 bottom-full mb-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-400">
              <h3 className="text-white text-lg font-semibold">How can I help you?</h3>
              <p className="text-blue-100 text-sm mt-1">Select an option below</p>
            </div>
            <div className="p-3">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  className="w-full flex items-start p-4 text-left hover:bg-gray-50 transition-colors duration-200 rounded-xl group relative overflow-hidden"
                  onClick={() => handleOptionClick(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${option.color}" />
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center flex-shrink-0`}>
                    <option.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-gray-900 font-medium">{option.text}</h4>
                    <p className="text-gray-500 text-sm mt-1">{option.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && (
          <ChatWithAI onClose={() => setShowChat(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmergencyChat && (
          <EmergencyChatbot onClose={() => setShowEmergencyChat(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReportForm && (
          <ReportForm onClose={() => setShowReportForm(false)} />
        )}
      </AnimatePresence>

      <motion.button
        className={`${
          isOpen 
            ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
            : 'bg-gradient-to-r from-blue-600 to-blue-400'
        } text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative`}
        onClick={() => setIsOpen(!isOpen)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
            <FaRobot className="w-6 h-6" />
          </motion.div>
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-xl shadow-lg text-sm whitespace-nowrap"
            >
              Chat with AI
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 transform rotate-45 w-2 h-2 bg-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatbotButton; 

  