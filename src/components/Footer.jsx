"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-100 py-8 relative"> 
      {/* Wave Background (Upside Down) */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-blue-200 to-blue-100 transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,160L48,138.7C96,117,192,75,288,96C384,117,480,181,576,186.7C672,192,768,139,864,138.7C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Get to Know */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Get to Know</h3> 
            <ul className="space-y-2">
              <li><a href="#" className="text-black hover:text-blue-500">Privacy Policy</a></li> 
              <li><a href="#" className="text-black hover:text-blue-500">Cancellation/Refund Policy</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">FAQ</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">Terms of Service</a></li>
            </ul>
          </div>

          {/* Grievance */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Grievance</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-black hover:text-blue-500">CPGRAMS</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">National Consumer Helpline</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-black hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">Dashboard</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">Schemes</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">Our Partners</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">Contact Us</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">Video Guide</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">eBook</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">User Manual</a></li>
              <li><a href="#" className="text-black hover:text-blue-500">Accessibility</a></li>
            </ul>
          </div>

          {/* Useful Links & Visitors */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Useful Links</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <a href="#" className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                {/* NEGD Logo Placeholder */}
                <span className="text-xs text-black">NEGD</span> 
              </a>
              <a href="#" className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                {/* Digital India Logo Placeholder */}
                <span className="text-xs text-black">DI</span>
              </a>
              <a href="#" className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                {/* MyGov Logo Placeholder */}
                <span className="text-xs text-black">MyGov</span>
              </a>
              <a href="#" className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                {/* India.gov.in Logo Placeholder */}
                <span className="text-xs text-black">India</span>
              </a>
            </div>
            <p className="text-sm text-black">Visitors: 48,508,449</p> 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;