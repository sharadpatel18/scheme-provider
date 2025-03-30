"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaRobot, FaUser } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

const formatResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
    .replace(/\n/g, "<br/>")
    .replace(/\* (.*?)\n/g, "<li>$1</li>");
};

const ChatWithAI = ({ onClose }) => {
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
      { text: "Hi there! 👋 I'm Sharthi, your AI assistant. How can I help you today?", sender: "bot" }
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
      { text: "Thinking...", sender: "bot", typing: true }
    ]);

    try {
      const chatHistory = messages.filter(msg => !msg.typing)
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const userData = user ? {
        name: `${user.firstName} ${user.lastName}`,
        age: new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear(),
        gender: user.gender,
        occupation: user.occupation,
        education: user.education,
        maritalStatus: user.maritalStatus,
        location: {
          address: `${user.addressLine1}, ${user.addressLine2}`,
          city: user.city,
          state: user.state,
          pincode: user.pincode
        },
        contact: {
          mobile: user.mobile,
          email: user.email,
          preferredLanguage: user.preferredLanguage
        },
        documents: {
          aadhaarNumber: user.aadhaarNumber,
          panNumber: user.panNumber
        },
        category: user.category,
        disability: {
          hasDisability: user.disability === "yes",
          percentage: user.disabilityPercentage,
          type: user.disabilityType
        }
      } : null;

      const prompt = `You are Sharthi, a helpful chatbot that provides personalized information about government schemes and facilities. Follow these rules:

      1. DEVELOPER INFORMATION:
         - When asked about who created you or who made you, always respond:
           "I was developed by the Hack Titans team. They created me to help citizens access government schemes and facilities easily."
         - If asked about your capabilities or features, mention that you're an AI assistant created by Hack Titans
         - Maintain a professional tone when discussing your development team

      2. SCHEME MATCHING PROCESS:
         - First analyze the user's profile data for eligibility criteria
         - If critical data is missing for scheme matching, ask for it specifically
         - Once you have sufficient data, recommend maximum 3 most relevant schemes
         - For each scheme provide:
           * Scheme name and brief description
           * Why it matches their profile
           * Key benefits they would receive
           * Basic application process

      3. INTERACTION RULES:
         - Be concise and friendly
         - When asking for missing data, ask one piece at a time
         - Explain why you need the additional information
         - Remember previous answers and use them in recommendations
         - If the user provides new information, update your recommendations accordingly

      4. SCHEME-SPECIFIC DATA COLLECTION:
         For Educational Schemes (like MYSY):
         - Ask for academic details:
           * 10th and 12th marks/percentages
           * Current education level and year
           * Family annual income
           * Previous scholarships received
         
         For Employment Schemes:
         - Ask for:
           * Work experience
           * Skills and certifications
           * Current employment status
           * Expected salary range

         For Health Schemes:
         - Ask for:
           * Specific health conditions
           * Previous medical history
           * Current treatments
           * Medical insurance status

         For Agricultural Schemes:
         - Ask for:
           * Land ownership details
           * Crop types
           * Farming experience
           * Previous scheme benefits

         For Business Schemes:
         - Ask for:
           * Business type/plan
           * Investment capacity
           * Experience in the field
           * Expected loan requirement

      5. PRIORITIZATION RULES:
         - Prioritize schemes based on:
           * User's immediate needs (based on profile and queries)
           * Higher benefit amounts
           * Simpler application process
           * Upcoming deadlines
         - Consider special categories (SC/ST/OBC/Disability) if applicable
         - Factor in location-specific schemes for their state

      6. RESPONSE FORMAT:
         - Keep initial responses under 3 sentences
         - Use bullet points for scheme details
         - Highlight important deadlines or documents needed
         - If asking for information, explain why it's needed
         - Format key benefits and eligibility clearly
         - When collecting data, explain how it affects eligibility

      7. MISSING DATA HANDLING:
         - If user asks about a specific scheme, check required criteria
         - Ask for missing data one by one in order of importance
         - Explain why each piece of information is needed
         - Store provided information and use it in subsequent responses
         - Once all required data is collected, provide detailed scheme eligibility

      User Profile Data:
      ${userData ? JSON.stringify(userData, null, 2) : 'No user data available'}

      Chat History:
      ${chatHistory}
      
      User: ${message}
      Sharthi:`;
      
      const result = await model.generateContent(prompt);
      let responseText = await result.response.text();
      
      const botMessage = { text: formatResponse(responseText), sender: "bot" };
      setMessages(prev => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      setMessages(prev => [...prev.slice(0, -1), { text: "I apologize, but I'm having trouble connecting right now. Please try again.", sender: "bot" }]);
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FaRobot className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-semibold leading-none mb-1">Sharthi AI</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <p className="text-blue-100 text-xs">Online</p>
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

      {/* Chat Messages */}
      <div className="h-[calc(100%-180px)] overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
              msg.sender === "user" ? "bg-blue-600" : "bg-white shadow-md"
            }`}>
              {msg.sender === "user" ? (
                <FaUser className="text-white text-sm" />
              ) : (
                <FaRobot className="text-blue-600 text-sm" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
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
            placeholder="Type your message..."
            className="flex-1 px-6 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center"
          >
            <FaPaperPlane className={`${loading ? 'opacity-50' : ''}`} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatWithAI; 