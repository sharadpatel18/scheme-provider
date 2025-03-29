"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhone, FaHospital, FaAmbulance, FaStethoscope, FaPills, FaNotesMedical, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Health = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hospitals');

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("profileData"));
    setUser(userData);
    fetchHealthData(userData);
  }, []);

  const fetchHealthData = async (userData) => {
    if (!userData) {
      setLoading(false);
      return;
    }

    try {
      const prompt = `Based on the user's location and profile, provide nearby medical facilities and health recommendations. Format the response as JSON with this structure:
      {
        "hospitals": [
          {
            "name": "City Hospital",
            "address": "123 Main St",
            "contact": "1234567890",
            "distance": "2.5 km",
            "specialties": ["General Medicine", "Cardiology"],
            "rating": "4.5"
          }
        ],
        "pharmacies": [
          {
            "name": "City Pharmacy",
            "address": "456 Health St",
            "contact": "9876543210",
            "distance": "1.2 km",
            "is24x7": true
          }
        ],
        "recommendations": [
          {
            "title": "Regular Health Checkup",
            "description": "Schedule a comprehensive health checkup based on your age and medical history",
            "priority": "high"
          }
        ]
      }

      User Profile:
      Name: ${userData.name}
      Age: ${userData.age}
      Gender: ${userData.gender}
      Location: ${userData.city}, ${userData.state}
      Address: ${userData.addressLine1}, ${userData.addressLine2}
      Pincode: ${userData.pincode}
      Disability: ${userData.disability || 'None'}`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(cleanResponse);
      setHealthData(parsedData);
    } catch (error) {
      console.error('Error fetching health data:', error);
      // Set default data in case of error
      setHealthData({
        hospitals: [
          {
            name: "City Hospital",
            address: "123 Main St",
            contact: "1234567890",
            distance: "2.5 km",
            specialties: ["General Medicine", "Cardiology"],
            rating: "4.5"
          }
        ],
        pharmacies: [
          {
            name: "City Pharmacy",
            address: "456 Health St",
            contact: "9876543210",
            distance: "1.2 km",
            is24x7: true
          }
        ],
        recommendations: [
          {
            title: "Regular Health Checkup",
            description: "Schedule a comprehensive health checkup based on your age and medical history",
            priority: "high"
          }
        ]
      });
    }
    setLoading(false);
  };

  const categories = [
    { id: 'hospitals', icon: FaHospital, label: 'Hospitals', color: 'from-blue-600 to-blue-500' },
    { id: 'pharmacies', icon: FaPills, label: 'Pharmacies', color: 'from-green-600 to-green-500' },
    { id: 'recommendations', icon: FaNotesMedical, label: 'Recommendations', color: 'from-purple-600 to-purple-500' },
  ];

  const renderContent = () => {
    if (!healthData) return null;

    const data = healthData[activeTab] || [];
    
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
            {activeTab === 'recommendations' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                  {item.address}
                </p>
                <div className="flex items-center justify-between">
                  <a href={`tel:${item.contact}`} className="text-blue-600 hover:underline flex items-center gap-2">
                    <FaPhone className="text-sm" />
                    {item.contact}
                  </a>
                  <span className="text-sm text-gray-500">{item.distance}</span>
                </div>
                {activeTab === 'hospitals' && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Rating: {item.rating}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{item.specialties.join(', ')}</span>
                  </div>
                )}
                {activeTab === 'pharmacies' && item.is24x7 && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    24x7 Available
                  </span>
                )}
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FaStethoscope className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-semibold leading-none mb-1">Health Services</h3>
              <p className="text-blue-100 text-xs">Find medical help nearby</p>
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
        <div className="grid grid-cols-3 gap-2">
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
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <div className="text-center text-gray-500 py-8">
            Please log in to view health services and recommendations
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

export default Health; 