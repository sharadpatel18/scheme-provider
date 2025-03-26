"use client";

import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SendHorizonal, Bot } from "lucide-react";

const formatResponse = (text) => {
  return `<strong>Sharthi:</strong> ` + text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
    .replace(/\n/g, "<br/>")
    .replace(/\* (.*?)\n/g, "<li>$1</li>");
};

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { text: "<em>Sharthi is typing...</em>", sender: "bot", typing: true },
    ]);

    try {
      const chatHistory = messages.filter((msg) => !msg.typing)
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const prompt = `You are \"Sharthi,\" a helpful AI chatbot that assists users with government schemes and facilities. Keep responses short, natural, and friendly.\n\nUser: ${input}\nSharthi:`;

      const result = await model.generateContent(prompt);
      let responseText = await result.response.text();
      
      const botMessage = { text: formatResponse(responseText), sender: "bot" };
      setMessages((prev) => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev.slice(0, -1), { text: "<strong>Sharthi:</strong> Oops! Something went wrong.", sender: "bot" }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col max-w-full mx-auto h-screen bg-gray-100 border rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold p-4 flex items-center gap-2">
        <Bot className="w-6 h-6" />
        <span>Sharthi - AI Chatbot</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-2xl shadow-md text-white max-w-xs ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-800"}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}>
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
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full hover:opacity-80 transition"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
