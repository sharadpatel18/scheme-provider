"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { User2 } from "lucide-react";
import Head from 'next/head';

const images = [
  "/Images/delhigate.jpeg",
  "/Images/farmer.jpeg",
  "/Images/school.jpeg",
  "/Images/delhigate.jpeg",
];

const topics = [
  {
    title: 'The India and its government',
    description: 'Learn about India laws, history, and more.',
    icon: '/services/building.png', // Replace with your icon path
  },
  {
    title: 'Complaints',
    description: 'File complaints involving government agencies, telemarketers, products and services, travel, housing, and banking.',
    icon: '/services/message.jpeg', // Replace with your icon path
  },
  {
    title: 'Disability services',
    description: 'Find government benefits and programs for people with disabilities and their families.',
    icon: '/services/disable.jpeg', // Replace with your icon path
  },
  {
    title: 'Disasters and emergencies',
    description: 'Learn about disaster relief and find government benefits for other emergencies.',
    icon: '/services/speaker.jpeg', // Replace with your icon path
  },
  {
    title: 'Scams and fraud',
    description: 'Report a scam and get help. And learn about identity theft and social security scams.',
    icon: '/services/warning.jpeg', // Replace with your icon path
  },
  {
    title: 'Education',
    description: 'Find Student benefits and scholarship program and courses that help to student',
    icon: '/services/certificate.jpeg', // Replace with your icon path
  },
  {
    title: 'Government benefits',
    description: 'Find government Scheme that may help pay for food, housing, health care, and more.',
    icon: '/services/benefits.png', // Replace with your icon path
  },
  {
    title: 'Health',
    description: 'Get information about health insurance, various health conditions, and help with medical bills.',
    icon: '/services/health.png', // Replace with your icon path
  },
  {
    title: 'Laws and legal issues',
    description: 'Learn how to replace vital records, get child support enforcement, find legal help, and more.',
    icon: '/laws.png', // Replace with your icon path
  },
];
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            {/* <img
              src="/user-avatar.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-2"
            /> */}
            <User2 size={32} />
            <span className="text-lg font-semibold">Hey, User</span>
          </div>
        </div>

        {/* Main Content Area (Rounded Boxes) */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out space-x-4"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {images.concat(images).map((image, index) => (
              <div key={index} className="w-1/3 flex-shrink-0 px-2">
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  width={500}
                  height={350}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center my-6">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === index ? "bg-blue-500" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Quick Services Section */}
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-lg font-semibold">Quick Services</span>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Health Card */}
          <div className="bg-gradient-to-r from-green-200 to-green-100 p-4 rounded-lg">
            <Image
              src="/Images/health.png"
              alt="Health Icon"
              className="w-10 h-10 mb-2"
              width={100}
              height={100}
            />
            <h3 className="text-lg font-semibold mb-1">Health</h3>
            <p className="text-sm text-gray-600">
              Quick medical service, one click ambulance and more...
            </p>
          </div>

          {/* Emergency Card */}
          <div className="bg-gradient-to-r from-red-200 to-red-100 p-4 rounded-lg">
            <Image
              src="/Images/emergency.png"
              alt="Emergency Icon"
              className="w-10 h-10 mb-2"
              width={100}
              height={100}
            />
            <h3 className="text-lg font-semibold mb-1">Emergency</h3>
            <p className="text-sm text-gray-600">
              Quick Emergency service, Women/Children Helpline, one click police
              support
            </p>
          </div>

          {/* Report Issues Card */}
          <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 p-4 rounded-lg">
            <Image
              src="/Images/warning.png"
              alt="Report Icon"
              className="w-10 h-10 mb-2"
              width={100}
              height={100}
            />
            <h3 className="text-lg font-semibold mb-1">Report Issues</h3>
            <p className="text-sm text-gray-600">
              File Complaints Against Govt Services & Report a Crime instantly
            </p>
          </div>

          {/* Helpline Card */}
          <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-4 rounded-lg">
            <Image
              src="/Images/helpline.png"
              alt="Helpline Icon"
              className="w-10 h-10 mb-2"
              width={100}
              height={100}
            />
            <h3 className="text-lg font-semibold mb-1">Helpline</h3>
            <p className="text-sm text-gray-600">
              24/7 support and grievance redressal & all necessary helpline
              numbers
            </p>
          </div>
        </div>
      </div>

      
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-semibold">All topics and services</h1>
        </div>
      </header>

      <main className="max-w-full h-screen bg-white container px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
          {topics.map((topic, index) => (
            <div key={index} className="bg-white rounded-lg  p-4 border border-gray-300 shadow-lg shadow-blue-100">
              <div className="flex justify-center mb-4">
                <img src={topic.icon} alt={topic.title} className="h-10 w-10" />
              </div>
             <div className=" border-t-2 border-dotted border-gray-300">
             <h2 className="text-lg font-bold mb-2">{topic.title}</h2>
             <p className="text-gray-600 text-sm">{topic.description}</p>
             </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
