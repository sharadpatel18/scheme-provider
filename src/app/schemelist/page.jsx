"use client";

import { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Search, Filter } from "lucide-react";
import { SchemeContext } from "@/context/SchemeProvider";
import { useRouter } from "next/navigation";

const count = 109;
const category = "Agriculture, Rural & Environment";

const SchemesList = () => {
    const {catagory , setSelectedSchemes} = useContext(SchemeContext);
  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(true); // Loading state added
  const router = useRouter();

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
              "description": "mediem length description of the scheme.",
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
    router.push("/schemedetails");
}

  return (
    <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar Filters */}
    <aside className="w-1/4 bg-white p-5 border-r shadow-md">
      <h2 className="text-lg font-semibold mb-3">Filters</h2>
      <button className="text-blue-500 text-sm mb-3"  disabled={loading}>Reset</button>
      <div className="mb-4">
        <h3 className="text-gray-700 font-medium">State</h3>
        <div className="space-y-2 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="state"
              value=""
              checked={!selectedState}
              onChange={() => setSelectedState("")}
            />
            <span>All</span>
          </label>
          {["Gujarat", "Tamil Nadu", "Puducherry", "Rajasthan"].map((state) => (
            <label key={state} className="flex items-center space-x-2">
              <input
                type="radio"
                name="state"
                value={state}
                checked={selectedState === state}
                onChange={() => setSelectedState(state)}
              />
              <span>{state}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-6">
      {/* Header */}
  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Total <span className="text-blue-600">{filteredSchemes.length}</span> Schemes Available
        </h1>
        <h1 className="text-2xl font-bold">
        {loading ? (
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h12c0-6.627-5.373-12-12-12z"></path>
            </svg>
            <span>Fectching Schemes...</span>
          </div>
        ) : (
          "Government Schemes"
        )}
      </h1>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Schemes"
            className="w-full px-4 py-2 border rounded-lg shadow-sm pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
      </div>

      {/* Scheme List */}
      <div className="space-y-4">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme, index) => (
            <div
              key={index}
              className="p-5 bg-white border rounded-xl shadow-md transition hover:shadow-lg"
                onClick={()=>handleRoute(scheme)}
            >
              <h3 className="text-sm text-gray-500">{scheme.state}</h3>
              <h2 className="text-lg font-semibold text-blue-600">{scheme.title}</h2>
              <p className="text-gray-600 mt-2">{scheme.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {scheme.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading.....</p>
        )}
      </div>
    </main>
  </div>
  );
};

export default SchemesList;
