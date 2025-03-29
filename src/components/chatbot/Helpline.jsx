"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhone, FaHospital, FaAmbulance, FaShieldAlt, FaFireExtinguisher, FaChild, FaFemale, FaSearch } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Helpline = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [helplineData, setHelplineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('emergency');

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("profileData"));
    setUser(userData);
    fetchHelplineData(userData);
  }, []);

  const fetchHelplineData = async (userData) => {
    if (!userData) {
      setLoading(false);
      return;
    }

    try {
      const prompt = `Based on the user's location, provide emergency helpline numbers and nearby facilities. Return ONLY a JSON object with this exact structure:
      {
        "emergency": [
          {"name": "Emergency Helpline", "number": "112", "description": "National Emergency Number"},
          {"name": "Police", "number": "100", "description": "Police Emergency"}
        ],
        "medical": [
          {"name": "City Hospital", "address": "123 Main St", "contact": "1234567890", "distance": "2.5 km"}
        ],
        "police": [
          {"name": "Central Police Station", "address": "456 Police St", "contact": "9876543210", "distance": "1.8 km"}
        ],
        "women": [
          {"name": "Women Helpline", "number": "1091", "description": "24/7 Women Safety Helpline"}
        ]
      }

      User Location:
      City: ${userData.city}
      State: ${userData.state}
      Pincode: ${userData.pincode}
      Address: ${userData.addressLine1}, ${userData.addressLine2}`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(cleanResponse);
      
      setHelplineData(parsedData);
    } catch (error) {
      console.error('Error fetching helpline data:', error);
      // Set default data in case of error
      setHelplineData({
        emergency: [
          { name: "Emergency Helpline", number: "112", description: "National Emergency Number" },
          { name: "Police", number: "100", description: "Police Emergency" }
        ],
        medical: [
          { name: "City Hospital", address: "123 Main St", contact: "1234567890", distance: "2.5 km" }
        ],
        police: [
          { name: "Central Police Station", address: "456 Police St", contact: "9876543210", distance: "1.8 km" }
        ],
        women: [
          { name: "Women Helpline", number: "1091", description: "24/7 Women Safety Helpline" }
        ]
      });
    }
    setLoading(false);
  };

  const categories = [
    { id: 'emergency', icon: FaPhone, label: 'Emergency', color: 'from-red-500 to-red-600' },
    { id: 'medical', icon: FaHospital, label: 'Hospitals', color: 'from-blue-500 to-blue-600' },
    { id: 'police', icon: FaShieldAlt, label: 'Police', color: 'from-indigo-500 to-indigo-600' },
    { id: 'women', icon: FaFemale, label: 'Women Safety', color: 'from-pink-500 to-pink-600' },
  ];

  const renderContent = () => {
    if (!helplineData) return null;

    const data = helplineData[activeTab] || [];
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {activeTab === 'emergency' || activeTab === 'women' ? (
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                  activeTab === 'emergency' ? 'from-red-500 to-red-600' : 'from-pink-500 to-pink-600'
                } flex items-center justify-center flex-shrink-0`}>
                  <FaPhone className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <a href={`tel:${item.number}`} className="text-blue-600 hover:underline">{item.number}</a>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <FaSearch className="mt-1 flex-shrink-0" />
                  {item.address}
                </p>
                <div className="flex items-center justify-between">
                  <a href={`tel:${item.contact}`} className="text-blue-600 hover:underline flex items-center gap-2">
                    <FaPhone className="text-sm" />
                    {item.contact}
                  </a>
                  <span className="text-sm text-gray-500">{item.distance}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-24 right-6 w-96 h-[70vh] bg-white rounded-3xl shadow-2xl overflow-hidden z-50 border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FaPhone className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-semibold leading-none mb-1">Emergency Helplines</h3>
              <p className="text-purple-100 text-xs">Find help nearby</p>
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

      {/* Categories */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-4 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                activeTab === category.id
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <category.icon className={`text-lg ${activeTab === category.id ? 'text-white' : ''}`} />
              <span className="text-xs font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[calc(100%-180px)] bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="text-center text-gray-500 py-8">
            Please log in to view helpline numbers and nearby facilities
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default Helpline; 