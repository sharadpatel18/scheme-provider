"use client";
import { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { SchemeContext } from "@/context/SchemeProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const { setCatagory } = useContext(SchemeContext);
  
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserProfile = () => {
      try {
        const profileData = localStorage.getItem('userProfile');
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
    setCatagory(scheme);
    router.push("/schemes-section/schemelist");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schemes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center pt-8 mb-2">Schemes on Sangam</h1>
          <p className="text-gray-600 text-center mb-8">
            Explore seamless access to many government services and schemes at one place, ensuring hassle-free and transparent
            experience for citizens.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search For Schemes"
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Explore Eligible Schemes */}
        <Link href={userProfile ? "/dashboard" : "/auth/signup"} className="block">
          <div className="bg-white rounded-lg p-4 flex items-center justify-between mb-8 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <span className="font-medium">
                {userProfile ? "View Your Eligible Schemes" : "Explore Eligible Schemes"}
              </span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </Link>

        {/* Recommended Schemes */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Recommended Schemes</h2>
          {userProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedSchemes.map((scheme, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCatagories(scheme)}
                >
                  <h3 className="font-medium text-lg mb-2">{scheme.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{scheme.ministry}</p>
                  <p className="text-gray-700 mb-3">{scheme.description}</p>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Eligibility:</span>
                    <p className="text-gray-600">{scheme.eligibility}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <img 
                src="https://placehold.co/200x200/e2e8f0/64748b?text=Profile+Required" 
                alt="Profile Required"
                className="mx-auto mb-4 w-48"
              />
              <p className="text-gray-600 mb-4">Complete your profile to view personalized scheme recommendations.</p>
              <Link 
                href="/profile" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Complete Profile
              </Link>
            </div>
          )}
        </div>

        {/* Trending Schemes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Trending Schemes</h2>
            <div className="flex items-center space-x-4">
              <Link href="/view-all" className="text-sm text-blue-600">
                View All (9)
              </Link>
              <div className="flex space-x-2">
                <button className="p-1 rounded border hover:bg-gray-50">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-1 rounded border hover:bg-gray-50">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {trendingSchemes.map((scheme, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCatagories(scheme)}
              >
                <div className="h-5 w-5 text-orange-500 mb-2">{scheme.icon}</div>
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{scheme.title}</h3>
                <p className="text-gray-500 text-sm">{scheme.ministry}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Schemes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Explore schemes</h2>
            <Link href="/view-all" className="text-sm text-gray-600">
              View All
            </Link>
          </div>
          <div className="flex space-x-4 mb-6">
            <button className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              Categories
            </button>
            <button className="text-gray-600 px-4 py-1 rounded-full text-sm hover:bg-gray-100">
              State/UTs
            </button>
            <button className="text-gray-600 px-4 py-1 rounded-full text-sm hover:bg-gray-100">
              Central Ministries
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schemes.map((category, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCatagories(category)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-orange-500 text-sm">{category.count} Schemes</span>
                </div>
                <h3 className="font-medium">{category.category}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
