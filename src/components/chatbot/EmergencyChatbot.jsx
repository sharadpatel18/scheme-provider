"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaPhone, FaAmbulance, FaShieldAlt, FaUser } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

const formatResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
    .replace(/\n/g, "<br/>")
    .replace(/\* (.*?)\n/g, "<li>$1</li>");
};

const EmergencyChatbot = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([
      { text: "Hello! 🚨 I'm your emergency assistance chatbot. How can I help you in this emergency?", sender: "bot" }
    ]);
    setUser(JSON.parse(localStorage.getItem("profileData")));
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    setMessages(prev => [
      ...prev,
      { text: "Analyzing your situation...", sender: "bot", typing: true }
    ]);

    try {
      const chatHistory = messages.filter(msg => !msg.typing)
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const userData = user ? {
        name: `${user.firstName} ${user.lastName}`,
        age: new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear(),
        gender: user.gender,
        location: {
          address: `${user.addressLine1}, ${user.addressLine2}`,
          city: user.city,
          state: user.state,
          pincode: user.pincode
        },
        contact: {
          mobile: user.mobile,
          alternatePhone: user.alternatePhone,
          email: user.email
        },
        disability: {
          hasDisability: user.disability === "yes",
          percentage: user.disabilityPercentage,
          type: user.disabilityType
        }
      } : null;

      const prompt = `You are an Emergency Assistant chatbot. Keep responses brief and focused on immediate help. Rules:
      1. Keep responses under 3 sentences
      2. Focus on immediate, life-saving actions first
      3. Provide emergency numbers when needed
      4. Give clear, step-by-step instructions
      5. Consider user's location and medical needs

      Emergency Numbers:
      - Emergency: 112
      - Police: 100
      - Ambulance: 108
      - Fire: 101

      User Profile:
      ${userData ? JSON.stringify({
        name: userData.name,
        location: userData.location,
        disability: userData.disability,
        contact: userData.contact.mobile
      }, null, 2) : 'No user data available'}

      Chat History:
      ${chatHistory}
      
      User: ${message}
      Assistant: Keep the response brief and focused on immediate actions.`;
      
      const result = await model.generateContent(prompt);
      let responseText = await result.response.text();
      
      const botMessage = { text: formatResponse(responseText), sender: "bot" };
      setMessages(prev => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      setMessages(prev => [...prev.slice(0, -1), { text: "I apologize, but I'm having trouble processing your request. Please call emergency services immediately if this is a life-threatening situation.", sender: "bot" }]);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-24 right-6 w-96 h-[70vh] bg-white rounded-3xl shadow-2xl overflow-hidden z-50 border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FaShieldAlt className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-semibold leading-none mb-1">Emergency Assistant</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <p className="text-red-100 text-xs">24/7 Available</p>
              </div>
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

      {/* Quick Action Buttons */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 p-4">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => window.location.href = 'tel:112'} 
            className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-700 py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <FaPhone className="text-sm" />
            <span className="text-sm font-medium">Emergency (112)</span>
          </button>
          <button 
            onClick={() => window.location.href = 'tel:108'} 
            className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-700 py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <FaAmbulance className="text-sm" />
            <span className="text-sm font-medium">Ambulance (108)</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-[calc(100%-230px)] overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
              msg.sender === "user" ? "bg-red-600" : "bg-white shadow-md"
            }`}>
              {msg.sender === "user" ? (
                <FaUser className="text-white text-sm" />
              ) : (
                <FaShieldAlt className="text-red-600 text-sm" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.sender === "user"
                  ? "bg-red-600 text-white"
                  : "bg-white shadow-md"
              } ${msg.typing ? "animate-pulse" : ""}`}
            >
              <div 
                className={`text-sm ${msg.sender === "user" ? "text-white" : "text-gray-800"}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your emergency..."
            className="flex-1 px-6 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-12 h-12 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600 flex items-center justify-center"
          >
            <FaPaperPlane className={`${loading ? 'opacity-50' : ''}`} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EmergencyChatbot; 