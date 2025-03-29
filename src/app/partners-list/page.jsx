"use client";
import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Search, ChevronRight, ChevronLeft, ArrowRight, Target, Building2, Grid, BookMarked, Share2, Info } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const PartnersList = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const servicesPrompt = `
          Return a JSON object with two keys: "categories" and "services".

          1️⃣ "categories": An array of service categories with:
            - "category" (category name)
            - "icon" (use emoji)
            - "count" (number of services)
            - "description" (brief description)
          Example:
            [
              {
                "category": "Education",
                "icon": "📚",
                "count": 15,
                "description": "Scholarships and educational support"
              }
            ]

          2️⃣ "services": An array of government services with:
            - "name" (service name)
            - "logo" (use emoji)
            - "category" (matching category name)
            - "description" (detailed description)
            - "eligibility" (who can apply)
            - "documents" (required documents)
            - "link" (use "#")
            - "popularity" (number 1-5)
          Example:
            [
              {
                "name": "PM Scholarship Scheme",
                "logo": "🎓",
                "category": "Education",
                "description": "Financial support for higher education",
                "eligibility": "Students with family income below 8L",
                "documents": "Income certificate, marksheet",
                "link": "#",
                "popularity": 5
              }
            ]

          Ensure the response is only JSON with no extra formatting.
        `;

        const result = await model.generateContent(servicesPrompt);
        let data = await result.response.text();
        data = data.replace(/```json|```/g, "").trim();
        let parsedData = JSON.parse(data);

        setCategories(parsedData.categories);
        setServices(parsedData.services);
      } catch (error) {
        console.error("Error fetching Gemini API data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.popularity - a.popularity;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-emerald-100"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Government Services Portal
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-cyan-200">
              Discover Government Services
            </h1>
            
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
              Find and connect with various government services tailored to your needs. Get detailed information and apply easily.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 transition-colors group">
                <input
                  type="text"
                  placeholder="Search services by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 rounded-xl bg-transparent text-white placeholder-emerald-200 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <Search className="absolute left-4 top-4 text-emerald-300" size={20} />
              </div>
            </motion.div>

            {/* Quick Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {["All Services", "Popular", "New", "Recently Updated"].map((filter, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-sm font-medium text-emerald-100 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 C280,84 1160,84 1440,50 L1440,100 L0,100 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <Grid className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Browse by Category</h2>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/view-all" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => setSelectedCategory(category.category)}
              >
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {category.category}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} services</p>
                <p className="text-sm text-gray-600 mt-2">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="group bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-2xl">{service.logo}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-emerald-600">{service.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors">
                        <BookMarked className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Eligibility</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{service.eligibility}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Required Documents</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{service.documents}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < service.popularity ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <Link
                      href={service.link}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
              </div>
              </motion.div>
            ))}
        </div>
      )}

        {/* No Results Message */}
        {!loading && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PartnersList;
