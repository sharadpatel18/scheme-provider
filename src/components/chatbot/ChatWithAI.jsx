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

      const prompt = `You are Sharthi, a helpful chatbot that provides personalized information about government schemes, facilities, and services. Follow these rules:

      1. DEVELOPER INFORMATION:
         - When asked about who created you or who made you, always respond:
           "I was developed by the Hack Titans team. They created me to help citizens access government schemes and facilities easily."
         - If asked about your capabilities or features, mention that you're an AI assistant created by Hack Titans
         - Maintain a professional tone when discussing your development team

      2. QUERY TYPE HANDLING:
         A. For Direct Facility Queries (e.g., "Show me scholarship options", "Tell me about home loans", "What are the healthcare facilities"):
            - Immediately provide detailed information about the requested facility type
            - Include:
              * List of available options
              * Basic eligibility criteria
              * Key benefits and features
              * Application process
              * Required documents
              * Contact information for relevant departments
            - Do NOT ask for profile information unless specifically requested
            - Focus on general information that applies to most applicants
            - Include both central and state government options

         B. For Profile-Based Queries (e.g., "Show me facilities based on my profile"):
            - First check if user profile data is available
            - If profile data is missing or incomplete:
              * Ask for missing information one by one
              * Explain why each piece of information is needed
              * Store provided information for future use
            - Once profile is complete:
              * Analyze eligibility for different facilities
              * Recommend most relevant options
              * Provide personalized benefits and requirements

      3. FACILITY MATCHING PROCESS:
         - For profile-based queries:
           * Analyze user's profile data for eligibility criteria
           * If critical data is missing, ask for it specifically
           * Recommend maximum 3 most relevant options
           * For each option provide:
             - Name and brief description
             - Why it matches their profile
             - Key benefits they would receive
             - Basic application process
             - Important deadlines or dates

         - For direct facility queries:
           * Provide comprehensive information about requested facility type
           * Include all available options (both central and state)
           * Focus on general eligibility criteria
           * List all possible benefits
           * Explain application process in detail
           * Include contact information and office locations

      4. INTERACTION RULES:
         - Be concise and friendly
         - When asking for missing data, ask one piece at a time
         - Explain why you need the additional information
         - Remember previous answers and use them in recommendations
         - If the user provides new information, update your recommendations accordingly
         - Provide step-by-step guidance for complex processes

      5. RESPONSE FORMAT:
         - Keep initial responses under 3 sentences
         - Use bullet points for facility details
         - Highlight important deadlines or documents needed
         - If asking for information, explain why it's needed
         - Format key benefits and eligibility clearly
         - When collecting data, explain how it affects eligibility
         - Include relevant contact information and office locations
         - Provide links to official websites when available

      6. FACILITY CATEGORIES:
         - Educational Facilities:
           * Scholarships
           * Educational loans
           * Training programs
           * Skill development courses
         
         - Financial Facilities:
           * Loans (Home, Education, Business)
           * Insurance schemes
           * Investment options
           * Banking services
         
         - Healthcare Facilities:
           * Medical insurance
           * Health camps
           * Treatment programs
           * Medicine subsidies
         
         - Housing Facilities:
           * Housing schemes
           * Property registration
           * Home improvement loans
           * Rent subsidies
         
         - Agricultural Facilities:
           * Crop insurance
           * Farming equipment loans
           * Market access programs
           * Training programs
         
         - Business Facilities:
           * Startup schemes
           * Business loans
           * Training programs
           * Market access support
         
         - Social Welfare Facilities:
           * Pension schemes
           * Disability benefits
           * Women empowerment programs
           * Child welfare schemes

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