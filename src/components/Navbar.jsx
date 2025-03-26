"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Correct hook for App Router
import {
  FaUniversalAccess,
  FaMoon,
  FaGlobeAmericas,
} from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const [showChatOptions, setShowChatOptions] = useState(false);
  const pathname = usePathname(); // Get the current path
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  return (
    <>
      <Head>
        <title>Government Services</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#006af4] to-[#5dbeff] text-white py-2 px-4 flex border-r-2 items-center justify-between">
        {/* Left Section (Logo and Ministry Name) */}
        <div className="flex items-center">
          <Image src="/Images/ministry.png" alt="Ministry Logo" width={70} height={70} />
          <div>
            <h2 className="text-sm font-semibold">Ministry of Electronics and</h2>
            <h2 className="text-sm font-semibold">Information Technology</h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 relative">
          <button className="flex items-center bg-transparent bg-opacity-20 rounded-md px-5 py-2 text-md border-opacity-30">
            <FaUniversalAccess className="mr-2" />
            Screen Reader
          </button>

          <button className="w-10 h-full flex items-center bg-transparent bg-opacity-20 rounded-md py-2 text-md border-opacity-30">
            <FaMoon className="mr-2" />
          </button>

          <button className="flex items-center bg-transparent bg-opacity-20 rounded-md px-3 py-2 text-md border border-white border-opacity-30">
            📢 Important
          </button>

          {/* Chatbot Button */}
          <div className="relative">
            <button
              className="flex items-center bg-transparent bg-opacity-20 rounded-md px-3 py-2 text-md border border-white border-opacity-30"
              onClick={() => setShowChatOptions(!showChatOptions)}
            >
              🤖 Chatbot
            </button>

            {showChatOptions && (
              <div className="absolute left-0 mt-2 w-54 bg-gray-900 text-white rounded-lg shadow-lg p-2">
                <Link href="/chatbot/chatwithai" className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md">
                  🗣 Chat with Sharthi AI
                </Link>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md">
                  🚨 Emergency
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded-md">
                  📝 Add Report & FIR
                </button>
              </div>
            )}
          </div>

          <button className="flex items-center bg-transparent bg-opacity-20 rounded-md px-3 py-2 text-md border border-white border-opacity-30">
            <FaGlobeAmericas className="mr-2" />
            English
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <nav className="bg-gray-200 p-2 flex items-center justify-between text-black">
        <div className="flex items-center">
          <Image src="/Images/logo.png" alt="UMANG Logo" width={200} height={70} />
        </div>

        <div>
          <ul className="flex ml-8 text-lg font-light space-x-4">
            <li>
              <Link href="/" className={`pb-1 ${pathname === "/" ? "border-b-2 border-blue-500" : "hover:border-b-2 hover:border-blue-500"}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={`pb-1 ${pathname === "/about" ? "border-b-2 border-blue-500" : "hover:border-b-2 hover:border-blue-500"}`}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className={`pb-1 ${pathname === "/services" ? "border-b-2 border-blue-500" : "hover:border-b-2 hover:border-blue-500"}`}>
                Services
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className={`pb-1 ${pathname === "/dashboard" ? "border-b-2 border-blue-500" : "hover:border-b-2 hover:border-blue-500"}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/schemes" className={`pb-1 ${pathname === "/schemes" ? "border-b-2 border-blue-500" : "hover:border-b-2 hover:border-blue-500"}`}>
                Schemes
              </Link>
            </li>
          </ul>
        </div>

        {/* Search and Login */}
        <div className="flex items-center">
          <div className="border border-white bg-white rounded-full px-5 py-2 flex items-center mr-4">
            <input type="text" placeholder="Search Scheme" className="border-none outline-none px-2 w-52" />
            <button className="bg-transparent border-none cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-blue-800 text-2xl font-semibold">{user.firstName}</span>
              <Link href={'/auth/login'} className="bg-blue-800 text-white px-6 py-3 rounded-md">
                Logout
              </Link>
            </div>
          ) : (
            <Link href={'/auth/signup'} className="bg-blue-800 text-white px-6 py-3 rounded-md">
              Login/Register
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

