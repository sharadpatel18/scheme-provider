"use client";

import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SendHorizonal, AlertTriangle } from "lucide-react";

const formatResponse = (text) => {
  const options = [];
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>")
    .replace(/\[(\d+)\] (.*?)(?=\n|$)/g, (_, num, option) => {
      options.push(option);
      return "";
    })
    .trim();

  return { text: formattedText, options };
};

export default function EmergencyChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([
      { 
        text: `<strong>Emergency Assistant:</strong> Hi! I'm here to help in emergencies. 
              Please tell me what's happening or choose an option:`,
        options: ["Medical Emergency", "Fire Hazard", "Accident", "Natural Disaster"],
        sender: "bot" 
      },
    ]);
  }, []);

  const sendMessage = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { text: "<em>Assistant is responding...</em>", sender: "bot", typing: true },
    ]);

    try {
      const chatHistory = messages
        .filter((msg) => !msg.typing)
        .map((msg) => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
        .join("\n");

      const prompt = `You are an emergency response assistant. Follow these rules:
      1. Speak naturally and empathetically
      2. Provide 2-3 clear options after your response
      3. Format options as [1] Option text
      4. Prioritize immediate action steps
      5. Keep responses conversational
      6. Remember previous context
      
      Chat History:
      ${chatHistory}
      
      User Input: ${message}
      
      Your Response (include 2-3 options if needed):`;

      const result = await model.generateContent(prompt);
      let response = await result.response.text();
      const { text, options } = formatResponse(response);
      
      const botMessage = { 
        text: `<strong>Emergency Assistant:</strong> ${text}`, 
        options,
        sender: "bot" 
      };
      
      setMessages((prev) => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev.slice(0, -1), { 
        text: `<strong>Emergency Assistant:</strong> Please contact emergency services immediately:
              <li>Police: 100</li>
              <li>Ambulance: 108</li>
              <li>Fire: 101</li>`, 
        sender: "bot" 
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col max-w-full mx-auto h-screen bg-red-50 border rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-semibold p-4 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6" />
        <span>Emergency Assistance</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-2xl shadow-md max-w-xl ${
              msg.sender === "user" 
                ? "bg-blue-500 text-white" 
                : "bg-red-100 text-gray-800"
            }`}>
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              {msg.options && msg.sender === "bot" && (
                <div className="mt-2 space-y-2">
                  {msg.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(option)}
                      className="w-full p-2 text-left rounded-lg bg-white border border-red-200 hover:bg-red-50 transition-colors"
                    dangerouslySetInnerHTML={{ __html: option }}
                   >
                   
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center p-3 bg-white border-t shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Describe your emergency..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="ml-2 bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-full hover:opacity-80 disabled:opacity-50 transition"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}