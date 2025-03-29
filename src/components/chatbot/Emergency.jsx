"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhone, FaAmbulance, FaShieldAlt, FaFemale, FaChild, FaFireExtinguisher, FaExclamationTriangle } from 'react-icons/fa';

const Emergency = ({ onClose }) => {
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const emergencyServices = [
    {
      id: 'police',
      title: 'Police Emergency',
      number: '100',
      icon: FaShieldAlt,
      color: 'from-blue-600 to-blue-500',
      description: 'For immediate police assistance'
    },
    {
      id: 'ambulance',
      title: 'Ambulance',
      number: '108',
      icon: FaAmbulance,
      color: 'from-red-600 to-red-500',
      description: 'For medical emergencies'
    },
    {
      id: 'women',
      title: 'Women Helpline',
      number: '1091',
      icon: FaFemale,
      color: 'from-pink-600 to-pink-500',
      description: '24/7 Women Safety Helpline'
    },
    {
      id: 'child',
      title: 'Child Helpline',
      number: '1098',
      icon: FaChild,
      color: 'from-yellow-600 to-yellow-500',
      description: 'For child safety and protection'
    },
    {
      id: 'fire',
      title: 'Fire Emergency',
      number: '101',
      icon: FaFireExtinguisher,
      color: 'from-orange-600 to-orange-500',
      description: 'For fire emergencies'
    }
  ];

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
              <FaExclamationTriangle className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-white font-semibold leading-none mb-1">Emergency Services</h3>
              <p className="text-red-100 text-xs">Quick access to emergency contacts</p>
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

      {/* Emergency Services Grid */}
      <div className="p-4 overflow-y-auto h-[calc(100%-80px)] bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          {emergencyServices.map((service) => (
            <motion.button
              key={service.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEmergency(service)}
              className={`bg-gradient-to-r ${service.color} p-4 rounded-xl text-white flex flex-col items-center gap-2 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <service.icon className="text-2xl" />
              <h3 className="font-semibold text-center">{service.title}</h3>
              <a 
                href={`tel:${service.number}`}
                className="text-white/90 hover:text-white flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <FaPhone className="text-sm" />
                {service.number}
              </a>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Emergency Details Modal */}
      <AnimatePresence>
        {selectedEmergency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedEmergency(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedEmergency.color} flex items-center justify-center`}>
                    <selectedEmergency.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedEmergency.title}</h3>
                    <p className="text-gray-500 text-sm">{selectedEmergency.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmergency(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <a
                  href={`tel:${selectedEmergency.number}`}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:shadow-lg transition-shadow"
                >
                  <FaPhone />
                  Call Now
                </a>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-2">Important Information:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• This is a 24/7 emergency service</li>
                    <li>• Provide clear location details when calling</li>
                    <li>• Stay on the line until help arrives</li>
                    <li>• Keep emergency numbers saved in your phone</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Emergency; 