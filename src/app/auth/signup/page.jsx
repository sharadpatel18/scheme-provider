"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const { confirmPassword, ...newFormData } = formData;
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFormData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const nextStep = () => {
    if (
      (step === 1 && !formData.firstName && !formData.middleName && !formData.lastName) ||
      (step === 2 && !formData.email) ||
      (step === 3 && (!formData.password || !formData.confirmPassword))
    ) {
      alert("Please fill in all the required fields!");
    } else {
      setStep(step + 1);
    }

    if (step === 3 && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
    }
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg p-8 bg-white/20 backdrop-blur-md rounded-xl shadow-2xl border border-white/10"
      >
        <h2 className="text-2xl font-bold text-center text-white">
          {step === 1
            ? "Personal Information"
            : step === 2
            ? "Email Address"
            : "Create Password"}
        </h2>

        {/* Progress Bar */}
        <div className="relative mt-4 h-2 w-full bg-white/30 rounded-full">
          <div
            className={`absolute top-0 left-0 h-2 bg-blue-400 rounded-full transition-all duration-300`}
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="mt-6 space-y-4">
          {step === 1 && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}

          {step === 2 && (
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-blue-400"
            />
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between space-x-4">
          <button
            onClick={prevStep}
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-all"
            disabled={step === 1}
          >
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-all"
            >
              Next
            </button>
          ) : (
            <button
              className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 transition-all"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          )}
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/forgot-password")}
              className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700 transition-all"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

