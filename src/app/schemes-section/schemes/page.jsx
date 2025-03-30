"use client";
import { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Search, ChevronRight, ChevronLeft, ArrowRight, Target, TrendingUp, Grid } from "lucide-react";
import { SchemeContext } from "@/context/SchemeProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Agriculture,Rural & Environment",
    count: 423,
    icon: "🌾",
  },
  {
    title: "Banking,Financial Services and Insurance",
    count: 220,
    icon: "🏦",
  },
  {
    title: "Business & Entrepreneurship",
    count: 495,
    icon: "💼",
  },
  {
    title: "Education & Learning",
    count: 797,
    icon: "🎓",
  },
  {
    title: "Health & Wellness",
    count: 221,
    icon: "🏥",
  },
  {
    title: "Housing & Shelter",
    count: 91,
    icon: "🏠",
  },
  {
    title: "Public Safety,Law & Justice",
    count: 192,
    icon: "⚖️",
  },
  {
    title: "Science, IT & Communications",
    count: 220,
    icon: "💻",
  },
  {
    title: "Skills & Employment",
    count: 250,
    icon: "🛠️",
  }
];

const trendingSchemes = [
  {
    title: "Deen Dayal Upadhyay Grameen Kaushalya Yojana",
    ministry: "Ministry Of Rural Development",
    icon: "📈"
  },
  {
    title: "National Means-Cum-Merit Scholarship",
    ministry: "Ministry of Education",
    icon: "📈"
  },
  {
    title: "Post Office Monthly Income Scheme",
    ministry: "Ministry Of Finance",
    icon: "📈"
  },
  {
    title: "Pradhan Mantri Jan Arogya Yojana",
    ministry: "Ministry Of Health",
    icon: "📈"
  }
];

const Schemes = () => {
  const router = useRouter();
  const { setSelectedSchemes } = useContext(SchemeContext);
  
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [filteredSchemes, setFilteredSchemes] = useState([]);

  const categoryMappings = {
    "All Categories": "All Categories",
    "Agriculture": "Agriculture, Rural & Environment",
    "Education": "Education & Learning",
    "Healthcare": "Health & Wellness",
    "Finance": "Banking, Financial Services and Insurance",
    "Housing": "Housing & Shelter",
    "Employment": "Skills & Employment"
  };

  useEffect(() => {
    const getUserProfile = () => {
      try {
        const profileData = localStorage.getItem('profileData');
        if (profileData) {
          setUserProfile(JSON.parse(profileData));
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
        setError('Failed to load user profile');
      }
    };

    getUserProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const categoryPrompt = `
          You must return a JSON array where the category names are always:
          - Agriculture, Rural & Environment
          - Banking, Financial Services and Insurance
          - Business & Entrepreneurship
          - Education & Learning
          - Health & Wellness
          - Housing & Shelter
          - Public Safety, Law & Justice
          - Science, IT & Communications
          - Skills & Employment

          For each category, return a Indian Government Scheme count. Ensure Scheme count between 10 and 100 and count was real not show any random number. 
          Example output:
          [
            {"category": "Education & Learning", "count": 500 , "icon": "🎓"},
            {"category": "Health & Wellness", "count": 220 , "icon": "🏥"}
          ]
          Ensure the response is only JSON with no extra formatting.
        `;

        const categoryResult = await model.generateContent(categoryPrompt);
        let categoryResponse = await categoryResult.response.text();
        categoryResponse = categoryResponse.replace(/```json|```/g, "").trim();
        setSchemes(JSON.parse(categoryResponse));

        if (userProfile) {
          const recommendationPrompt = `
            Based on the following user profile, recommend 5 most relevant government schemes:
            - State: ${userProfile.state}
            - Category: ${userProfile.category}
            - Education: ${userProfile.education}
            - Occupation: ${userProfile.occupation}
            - Disability: ${userProfile.disability}
            
            Return a JSON array with 5 schemes, each containing:
            - title: Scheme name
            - ministry: Ministry name
            - description: Brief description
            - eligibility: Key eligibility criteria
            
            Example format:
            [
              {
                "title": "Scheme Name",
                "ministry": "Ministry Name",
                "description": "Brief description",
                "eligibility": "Key eligibility criteria"
              }
            ]
          `;

          const recommendationResult = await model.generateContent(recommendationPrompt);
          let recommendationResponse = await recommendationResult.response.text();
          recommendationResponse = recommendationResponse.replace(/```json|```/g, "").trim();
          setRecommendedSchemes(JSON.parse(recommendationResponse));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to fetch schemes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile]);

  const handleCatagories = (scheme) => {
    setSelectedSchemes(scheme);
    router.push("/schemes-section/schemedetails");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All Categories") {
      setFilteredSchemes(schemes);
    } else {
      const mappedCategory = categoryMappings[category];
      const filtered = schemes.filter(scheme => 
        scheme.category === mappedCategory
      );
      setFilteredSchemes(filtered);
    }
  };

  useEffect(() => {
    setFilteredSchemes(schemes);
  }, [schemes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schemes...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-blue-600"
            >
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Available Schemes
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Browse Government Schemes
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Find and explore government schemes tailored to your needs. Get detailed information and eligibility criteria.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search schemes by name, category, or ministry..."
                    className="w-full px-6 py-3 pl-12 rounded-xl border-0 focus:outline-none text-gray-900 placeholder-gray-400"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                </div>
              </div>
            </motion.div>

            {/* Quick Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {["All Schemes", "Popular", "New", "Recently Updated"].map((filter, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Eligible Schemes Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href={userProfile ? "/dashboard" : "/auth/signup"} className="block">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 flex items-center justify-between mb-8 hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-2.5 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    {userProfile ? "View Your Eligible Schemes" : "Explore Eligible Schemes"}
                  </h3>
                  <p className="text-gray-500 text-sm">Get personalized scheme recommendations</p>
                </div>
              </div>
              <ArrowRight className="text-gray-400" />
            </div>
          </Link>
        </motion.div>

        {/* Recommended Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Recommended Schemes</h2>
            </div>
            <Link href="/view-all" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {userProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedSchemes.map((scheme, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group"
                  onClick={() => handleCatagories(scheme)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{scheme.title}</h3>
                      <p className="text-sm text-blue-600 mt-1">{scheme.ministry}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{scheme.description}</p>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Eligibility:</span>
                    <p className="text-gray-600 mt-1 line-clamp-2">{scheme.eligibility}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600 text-sm mb-6">Get personalized scheme recommendations based on your profile details.</p>
              <Link 
                href="/register" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Complete Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Trending Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Trending Schemes</h2>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/view-all" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All (9)
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {trendingSchemes.map((scheme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm p-5 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group"
                onClick={() => handleCatagories(scheme)}
              >
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{scheme.icon}</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{scheme.title}</h3>
                <p className="text-xs text-gray-600">{scheme.ministry}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Explore Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2.5 rounded-xl">
                <Grid className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Explore Schemes</h2>
                <p className="text-sm text-gray-500 mt-1">Browse through different categories of government schemes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <Link href="/view-all" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {Object.keys(categoryMappings).map((filter, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === filter
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden"
                onClick={() => handleCatagories(category)}
              >
                {/* Decorative background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-lg text-xs font-medium">
                      {category.count} Schemes
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {category.category}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Last updated: 2 days ago</span>
                    <span>•</span>
                    <span>Active schemes: {Math.floor(category.count * 0.8)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Schemes;
