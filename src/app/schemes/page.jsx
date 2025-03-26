"use client";
import { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Tractor,
  Banknote,
  Briefcase,
  GraduationCap,
  Heart,
  Building,
  Users,
  FlaskConical,
  Wrench,
  Bus,
  Plane,
  Gavel,
  Trophy,
} from "lucide-react";
import { SchemeContext } from "@/context/SchemeProvider";
import { useRouter } from "next/navigation";

// Predefined categories with icons
const predefinedCategories = [
  {
    category: "Agriculture, Rural & Environment",
    icon: <Tractor className="text-green-600" />,
  },
  {
    category: "Banking, Financial Services and Insurance",
    icon: <Banknote className="text-yellow-500" />,
  },
  {
    category: "Business & Entrepreneurship",
    icon: <Briefcase className="text-purple-500" />,
  },
  {
    category: "Education & Learning",
    icon: <GraduationCap className="text-red-500" />,
  },
  { category: "Health & Wellness", icon: <Heart className="text-green-500" /> },
  {
    category: "Housing & Shelter",
    icon: <Building className="text-blue-500" />,
  },
  {
    category: "Public Safety, Law & Justice",
    icon: <Gavel className="text-gray-600" />,
  },
  {
    category: "Science, IT & Communications",
    icon: <FlaskConical className="text-orange-500" />,
  },
  {
    category: "Skills & Employment",
    icon: <Users className="text-pink-500" />,
  },
  {
    category: "Social Welfare & Empowerment",
    icon: <Users className="text-purple-600" />,
  },
  { category: "Sports & Culture", icon: <Trophy className="text-green-400" /> },
  {
    category: "Transport & Infrastructure",
    icon: <Bus className="text-blue-400" />,
  },
  { category: "Travel & Tourism", icon: <Plane className="text-yellow-400" /> },
  {
    category: "Utility & Sanitation",
    icon: <Wrench className="text-red-400" />,
  },
  { category: "Women and Child", icon: <Users className="text-green-500" /> },
];

const Schemes = () => {
    const router = useRouter()
  const [schemes, setSchemes] = useState([]);
  const { setCatagory } = useContext(SchemeContext);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const genAI = new GoogleGenerativeAI(
          process.env.NEXT_PUBLIC_GEMINI_API_KEY
        );
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // **Fixed Prompt**: AI only provides counts, categories are fixed
        const prompt = `
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
        - Social Welfare & Empowerment
        - Sports & Culture
        - Transport & Infrastructure
        - Travel & Tourism
        - Utility & Sanitation
        - Women and Child

        For each category, return a Indian Government Scheme count. Ensure Scheme count between 10 and 100. 
        Example output:
        [
          {"category": "Education & Learning", "count": 500},
          {"category": "Health & Wellness", "count": 220},
          {"category": "Transport & Infrastructure", "count": 52}
        ]
        Ensure the response is only JSON with no extra formatting.
        `;

        const result = await model.generateContent(prompt);
        let response = await result.response.text();

        // 🛠 Fix: Remove Markdown (```json ... ```) if present
        response = response.replace(/```json|```/g, "").trim();

        // 🛠 Ensure JSON is valid before parsing
        let parsedData;
        try {
          parsedData = JSON.parse(response);

          // Validate and normalize data
          const mappedData = predefinedCategories.map((item) => {
            const found = parsedData.find((p) => p.category === item.category);
            return {
              category: item.category,
              count: found ? found.count : 0,
              icon: item.icon,
            };
          });

          setSchemes(mappedData);
        } catch (error) {
          console.error("Invalid AI response format:", response);
          setSchemes(predefinedCategories.map((c) => ({ ...c, count: 0 }))); // Default all counts to 0
        }
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchSchemes();
  }, []);

    const handleCatagories = (scheme) => {
      setCatagory(scheme);
      router.push("/schemelist");
    };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 text-center">
        Schemes on UMANG
      </h1>
      <p className="text-gray-500 text-center mt-2">
        Explore seamless access to many government services and schemes at one
        place, ensuring hassle-free and transparent experience for citizens.
      </p>

      {/* Search & Explore Section */}
      <div className="mt-6 flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Search For Schemes"
          className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />
        <button className="flex items-center justify-between w-full p-4 bg-white border rounded-lg shadow-sm hover:bg-gray-100" onClick={()=>router.push("/auth/signup")}>
          <span className="flex items-center text-blue-600 font-semibold">
            <span className="text-2xl mr-3">🔍</span> Explore Eligible Schemes
          </span>
          <span>➡️</span>
        </button>
      </div>

      {/* Recommended Schemes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Recommended Schemes</h2>
        <div className="p-4 border rounded-lg bg-gray-100 text-gray-500 text-center">
          Kindly enable location to view recommended schemes.
        </div>
      </div>

      {/* Trending Schemes */}
      {/* <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Trending Schemes</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {trendingSchemes.map((scheme, index) => (
          <div key={index} className="flex flex-col p-4 bg-white border rounded-lg shadow-sm min-w-[250px]">
            <div className="text-xl mb-2">📈</div>
            <h3 className="font-semibold">{scheme.name}</h3>
            <p className="text-sm text-gray-600">{scheme.ministry}</p>
          </div>
        ))}
      </div>
    </div> */}

      {/* Explore Schemes - Categories Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Explore Schemes</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Categories
          </button>
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md">
            State/UTs
          </button>
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md">
            Central Ministries
          </button>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
          {schemes.length > 0 ? (
            schemes.map((scheme, index) => (
              <div
                key={index}
                className="p-6 border rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:bg-blue-50 cursor-pointer transform hover:scale-105"
                onClick={()=>handleCatagories(scheme)}
              >
                <div className="text-4xl text-blue-600 mb-4">{scheme.icon}</div>
                <h2 className="font-bold text-gray-900 text-lg">
                  {scheme.category}
                </h2>
                <p className="text-gray-700">
                  {scheme.count} Schemes Available
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              🔄 Loading schemes...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schemes;
