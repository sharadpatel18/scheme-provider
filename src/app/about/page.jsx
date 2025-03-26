"use client";
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, Mail, Phone } from 'lucide-react';

const testimonials = [
  {
    name: "Rajesh Kumar",
    date: "Feb 15, 2024",
    text: "Sangam has made finding government schemes so much easier. The platform is user-friendly and helped me discover schemes I didn't even know existed!"
  },
  {
    name: "Priya Singh",
    date: "Feb 10, 2024",
    text: "As a farmer, I was looking for agricultural schemes. Sangam not only helped me find relevant schemes but also guided me through the application process."
  },
  {
    name: "Mohammed Ali",
    date: "Feb 5, 2024",
    text: "The best part about Sangam is how it simplifies complex government schemes into easy-to-understand information. Excellent platform!"
  }
];

const AboutPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/your-video-id"
                title="About Sangam"
                className="rounded-lg shadow-lg"
                allowFullScreen
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">About Sangam</h2>
              <p className="text-gray-600 leading-relaxed">
                Sangam is your comprehensive platform for discovering and accessing government schemes 
                in India. We bridge the gap between citizens and government initiatives by providing 
                a user-friendly interface to explore, understand, and apply for various schemes.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our mission is to ensure that every Indian citizen can easily find and benefit from 
                the numerous government schemes available to them. Whether you're a farmer, student, 
                entrepreneur, or senior citizen, Sangam helps you connect with the right opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">What Our Users Say</h2>
          <div className="relative">
            <div className="flex items-center">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex-1 mx-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`bg-white p-6 rounded-lg shadow-sm ${
                        index === currentTestimonial ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <span className="text-sm text-gray-500">{testimonial.date}</span>
                      </div>
                      <p className="text-gray-600">{testimonial.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Our Impact Gallery</h2>
          <div className="flex space-x-6 mb-8">
            <button className="text-blue-600 font-medium">All</button>
            <button className="text-gray-600 hover:text-gray-900">Success Stories</button>
            <button className="text-gray-600 hover:text-gray-900">Events</button>
            <button className="text-gray-600 hover:text-gray-900">Media</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmer Success Story */}
            <div className="relative h-64 group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-medium">Farmer Success Story</h3>
                  <p className="text-sm text-gray-200">Agricultural Schemes Impact</p>
                </div>
              </div>
            </div>

            {/* Rural Development */}
            <div className="relative h-64 group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-medium">Rural Development</h3>
                  <p className="text-sm text-gray-200">Community Progress</p>
                </div>
              </div>
            </div>

            {/* Education Initiatives */}
            <div className="relative h-64 group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-medium">Education Initiatives</h3>
                  <p className="text-sm text-gray-200">Student Scholarship Impact</p>
                </div>
              </div>
            </div>

            {/* Women Empowerment */}
            <div className="relative h-64 group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-medium">Women Empowerment</h3>
                  <p className="text-sm text-gray-200">Self-Help Group Success</p>
                </div>
              </div>
            </div>

            {/* Skill Development */}
            <div className="relative h-64 group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-red-500 to-red-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-medium">Skill Development</h3>
                  <p className="text-sm text-gray-200">Youth Training Programs</p>
                </div>
              </div>
            </div>

            {/* Healthcare Initiatives */}
            <div className="relative h-64 group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-medium">Healthcare Initiatives</h3>
                  <p className="text-sm text-gray-200">Medical Support Programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <MapPin className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-medium mb-2">Our Office</h3>
              <p className="text-center text-gray-600">
                Sangam Technologies Pvt. Ltd.,
                3rd Floor, Tech Hub,
                Sector 15, New Delhi - 110001
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <Mail className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-medium mb-2">Email Us</h3>
              <p className="text-center text-gray-600">
                contact@sangam.com
                support@sangam.com
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
              <Phone className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-medium mb-2">Call Us</h3>
              <p className="text-center text-gray-600">
                Toll Free: 1800-123-4567
                Support: +91-11-2345-6789
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer logos section */}
      <div className="flex justify-center space-x-8 py-8">
        <div className="w-[100px] h-[50px] bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm">
          Partner 1
        </div>
        <div className="w-[100px] h-[50px] bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm">
          Partner 2
        </div>
        <div className="w-[100px] h-[50px] bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm">
          Partner 3
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
