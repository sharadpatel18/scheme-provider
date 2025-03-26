"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <section className="relative w-full h-[400px] bg-blue-600 flex items-center justify-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold"
        >
          About Our Scheme Finder
        </motion.h1>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto p-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-lg text-gray-700 leading-relaxed"
        >
          Welcome to our Scheme Finder! Our mission is to help users easily
          discover and apply for government and private schemes that match their
          eligibility. With a user-friendly interface and AI-powered
          recommendations, we ensure you never miss an opportunity.
        </motion.p>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            Key Features of Scheme Finder
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "AI-powered Scheme Recommendations",
              "Real-time Eligibility Check",
              "Easy Application Process",
              "Comprehensive Scheme Details",
              "Secure & Private",
              "User-Friendly Interface",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 bg-blue-100 rounded-lg shadow-md text-center"
              >
                <h3 className="text-xl font-semibold">{feature}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "1. Browse Schemes", desc: "Explore a vast database of schemes from various sectors." },
            { title: "2. Check Eligibility", desc: "Instantly check if you're eligible for any scheme." },
            { title: "3. Apply Easily", desc: "Apply for schemes online in a hassle-free way." },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
              className="bg-white p-6 shadow-md rounded-lg"
            >
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-700">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">What Users Say</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-lg italic">
              "This platform helped me find the perfect scheme for my needs. The
              eligibility check feature saved me a lot of time!"
            </p>
            <p className="mt-4 font-bold">- Rahul Sharma</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Start Exploring Now</h2>
        <motion.a
          href="/schemes"
          className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Find Schemes
        </motion.a>
      </section>
    </div>
  );
}
