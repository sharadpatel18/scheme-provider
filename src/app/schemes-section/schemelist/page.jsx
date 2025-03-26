"use client";

import { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Search, ChevronLeft, ChevronDown } from "lucide-react";
import { SchemeContext } from "@/context/SchemeProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const count = 109;
const category = "Agriculture, Rural & Environment";

const SchemesList = () => {
    const {catagory , setSelectedSchemes} = useContext(SchemeContext);
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(true);
  const [isStateExpanded, setIsStateExpanded] = useState(true);
  const router = useRouter();

  const states = [
    { name: "All", count: 61 },
    { name: "Gujarat", count: 46 },
    { name: "Meghalaya", count: 39 },
    { name: "Tamil Nadu", count: 39 },
    { name: "Puducherry", count: 32 },
    { name: "Rajasthan", count: 28 },
    { name: "Bihar", count: 26 },
    { name: "Goa", count: 25 },
    { name: "Madhya Pradesh", count: 21 },
    { name: "Jharkhand", count: 15 },
    { name: "Haryana", count: 14 },
    { name: "Odisha", count: 13 },
    { name: "Arunachal Pradesh", count: 12 },
    { name: "Chhattisgarh", count: 9 },
    { name: "Assam", count: 8 },
    { name: "Himachal Pradesh", count: 8 },
    { name: "Maharashtra", count: 8 },
  ];

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="p-6 bg-white rounded-lg shadow-sm animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-full max-w-2xl bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((tagIndex) => (
              <div key={tagIndex} className="h-6 w-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchSchemes = async () => {
        setLoading(true); // Start loading
      console.log("Fetching schemes...");
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
          Generate exactly ${catagory?.count} government schemes for the category "${catagory?.category}". 

          🔹 **Response Format (Do NOT change the pattern):**
          - Return ONLY a JSON array (no extra text, markdown, or explanations).
          - Each object must have these exact fields:
            {
              "title": "Scheme Title",
              "description": "large length description of the scheme.",
              "tags": ["tag1", "tag2", "tag3"]
            }
          
          🔹 **Example Response (STRICT FORMAT - Do NOT modify structure):**
          [
            {
              "title": "Farmer Relief Assistance",
              "description": "Provides financial aid to farmers affected by natural disasters.",
              "tags": ["Relief", "Farmer", "Assistance"]
            }
          ]

          🔹 **Important Instructions:**
          - Ensure JSON output has ${count} schemes.
          - Keep field names the same (title, description, tags).
          - Do NOT include markdown, explanations, or extra text.
        `;

        const result = await model.generateContent(prompt);
        let response = await result.response.text();
        console.log("Raw API Response:", response);

        // Remove possible markdown code block formatting
        response = response.replace(/```json|```/g, "").trim();

        try {
          const parsedData = JSON.parse(response);
          setSchemes(parsedData);
        } catch (jsonError) {
          console.error("JSON Parsing Error:", jsonError);
          console.log("Malformed JSON response:", response);
        }
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    if (category && count) {
      fetchSchemes();
    }
  }, []);

  const filteredSchemes = schemes.filter((scheme) => 
    scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedState ? scheme.state === selectedState : true)
  );

  const handleRoute = (scheme) => {
    setSelectedSchemes(scheme);
    router.push("/schemes-section/schemedetails");
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/schemes-section" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-1">All Schemes</span>
            </Link>
            <div className="text-green-500 font-semibold text-xl">
              my<span className="text-gray-900">Scheme</span>
            </div>
            <div className="flex-1">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search Schemes"
                  className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <button 
                  className="text-green-500 text-sm hover:text-green-600"
                  disabled={loading}
                  onClick={() => setSelectedState("")}
                >
                  Reset
                </button>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">State</h3>
                  <button 
                    onClick={() => setIsStateExpanded(!isStateExpanded)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDown className={`h-5 w-5 transform transition-transform ${isStateExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isStateExpanded && (
                  <div className="space-y-2">
                    {states.map((state) => (
                      <label key={state.name} className="flex items-center justify-between py-1 cursor-pointer group">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="state"
                            value={state.name}
                            checked={selectedState === state.name || (state.name === "All" && !selectedState)}
                            onChange={() => setSelectedState(state.name === "All" ? "" : state.name)}
                            disabled={loading}
                            className="text-green-500 focus:ring-green-500"
                          />
                          <span className="ml-2 text-gray-700 group-hover:text-gray-900">{state.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{state.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-medium">
                {loading ? (
                  <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <>
                    Total <span className="text-green-500 font-semibold">{filteredSchemes.length}</span> Schemes Available
                  </>
                )}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Sort:</span>
                <select className="border-0 bg-transparent text-gray-900 font-medium focus:ring-0">
                  <option>Scheme Name (A{'>'}Z)</option>
                </select>
              </div>
            </div>

            {/* Schemes List */}
            <div className="space-y-4">
              {loading ? (
                <SkeletonLoader />
              ) : filteredSchemes.length > 0 ? (
                filteredSchemes.map((scheme, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRoute(scheme)}
                  >
                    <div className="text-sm text-gray-500 mb-2">{scheme.state || "Puducherry"}</div>
                    <h2 className="text-lg font-medium text-blue-600 mb-3">{scheme.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {scheme.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-lg">
                  <p className="text-gray-500">No schemes found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemesList;
