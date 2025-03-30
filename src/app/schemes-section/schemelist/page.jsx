"use client";

import { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Search, ChevronLeft, ChevronDown } from "lucide-react";
import { SchemeContext } from "@/context/SchemeProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";


const count = 10;
const catagory = "Skills & Employment"

const SchemesList = () => {
    const {catagory , setSelectedSchemes} = useContext(SchemeContext);
    const [schemes, setSchemes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [loading, setLoading] = useState(true);
    const [isStateExpanded, setIsStateExpanded] = useState(true);
    const [sortBy, setSortBy] = useState("name");
    const [activeFilter, setActiveFilter] = useState("All Schemes");
    const router = useRouter();

    // Calculate state counts from schemes data
    const getStateCounts = () => {
        const stateCounts = {};
        schemes.forEach(scheme => {
            const state = scheme.state || "Puducherry";
            stateCounts[state] = (stateCounts[state] || 0) + 1;
        });

        // Create states array with real counts
        return [
            { name: "All", count: schemes.length },
            // States
            { name: "Andhra Pradesh", count: stateCounts["Andhra Pradesh"] || 0 },
            { name: "Arunachal Pradesh", count: stateCounts["Arunachal Pradesh"] || 0 },
            { name: "Assam", count: stateCounts["Assam"] || 0 },
            { name: "Bihar", count: stateCounts["Bihar"] || 0 },
            { name: "Chhattisgarh", count: stateCounts["Chhattisgarh"] || 0 },
            { name: "Delhi", count: stateCounts["Delhi"] || 0 },
            { name: "Goa", count: stateCounts["Goa"] || 0 },
            { name: "Gujarat", count: stateCounts["Gujarat"] || 0 },
            { name: "Haryana", count: stateCounts["Haryana"] || 0 },
            { name: "Himachal Pradesh", count: stateCounts["Himachal Pradesh"] || 0 },
            { name: "Jammu and Kashmir", count: stateCounts["Jammu and Kashmir"] || 0 },
            { name: "Jharkhand", count: stateCounts["Jharkhand"] || 0 },
            { name: "Karnataka", count: stateCounts["Karnataka"] || 0 },
            { name: "Kerala", count: stateCounts["Kerala"] || 0 },
            { name: "Ladakh", count: stateCounts["Ladakh"] || 0 },
            { name: "Madhya Pradesh", count: stateCounts["Madhya Pradesh"] || 0 },
            { name: "Maharashtra", count: stateCounts["Maharashtra"] || 0 },
            { name: "Manipur", count: stateCounts["Manipur"] || 0 },
            { name: "Meghalaya", count: stateCounts["Meghalaya"] || 0 },
            { name: "Mizoram", count: stateCounts["Mizoram"] || 0 },
            { name: "Nagaland", count: stateCounts["Nagaland"] || 0 },
            { name: "Odisha", count: stateCounts["Odisha"] || 0 },
            { name: "Punjab", count: stateCounts["Punjab"] || 0 },
            { name: "Rajasthan", count: stateCounts["Rajasthan"] || 0 },
            { name: "Sikkim", count: stateCounts["Sikkim"] || 0 },
            { name: "Tamil Nadu", count: stateCounts["Tamil Nadu"] || 0 },
            { name: "Telangana", count: stateCounts["Telangana"] || 0 },
            { name: "Tripura", count: stateCounts["Tripura"] || 0 },
            { name: "Uttar Pradesh", count: stateCounts["Uttar Pradesh"] || 0 },
            { name: "Uttarakhand", count: stateCounts["Uttarakhand"] || 0 },
            { name: "West Bengal", count: stateCounts["West Bengal"] || 0 },
            // Union Territories
            { name: "Andaman and Nicobar Islands", count: stateCounts["Andaman and Nicobar Islands"] || 0 },
            { name: "Chandigarh", count: stateCounts["Chandigarh"] || 0 },
            { name: "Dadra and Nagar Haveli and Daman and Diu", count: stateCounts["Dadra and Nagar Haveli and Daman and Diu"] || 0 },
            { name: "Lakshadweep", count: stateCounts["Lakshadweep"] || 0 },
            { name: "Puducherry", count: stateCounts["Puducherry"] || 0 }
        ].filter(state => state.count > 0); // Only show states that have schemes
    };

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
            setLoading(true);
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
                        "tags": ["tag1", "tag2", "tag3"],
                        "state": "State Name",
                        "popularity": number between 1-5,
                        "isNew": boolean,
                        "lastUpdated": boolean,
                        "createdAt": "YYYY-MM-DD"
                      }
                    
                    🔹 **Example Response (STRICT FORMAT - Do NOT modify structure):**
                    [
                      {
                        "title": "Farmer Relief Assistance",
                        "description": "Provides financial aid to farmers affected by natural disasters.",
                        "tags": ["Relief", "Farmer", "Assistance"],
                        "state": "Gujarat",
                        "popularity": 4,
                        "isNew": true,
                        "lastUpdated": true,
                        "createdAt": "2024-03-15"
                      }
                    ]

                    🔹 **Important Instructions:**
                    - Ensure JSON output has ${count} schemes.
                    - Keep field names exactly the same.
                    - Randomly distribute states from the provided list.
                    - Set popularity randomly between 1-5.
                    - Set isNew and lastUpdated randomly as true/false.
                    - Set createdAt dates within the last 6 months.
                    - Do NOT include markdown, explanations, or extra text.
                    - Ensure all JSON is properly formatted with no trailing commas.
                `;

                const result = await model.generateContent(prompt);
                let response = await result.response.text();
                console.log("Raw API Response:", response);

                // Clean the response
                let cleanResponse = response
                    .replace(/```json|```/g, "") // Remove markdown code blocks
                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
                    .replace(/\n/g, " ") // Replace newlines with spaces
                    .replace(/\s+/g, " ") // Replace multiple spaces with single space
                    .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
                    .trim();

                try {
                    const parsedData = JSON.parse(cleanResponse);
                    // Validate the parsed data
                    if (!Array.isArray(parsedData)) {
                        throw new Error("Response is not an array");
                    }
                    // Ensure all required fields are present
                    const validatedData = parsedData.map(scheme => ({
                        title: scheme.title || "Untitled Scheme",
                        description: scheme.description || "No description available",
                        tags: Array.isArray(scheme.tags) ? scheme.tags : ["General"],
                        state: scheme.state || "Puducherry",
                        popularity: Number(scheme.popularity) || 1,
                        isNew: Boolean(scheme.isNew),
                        lastUpdated: Boolean(scheme.lastUpdated),
                        createdAt: scheme.createdAt || new Date().toISOString().split('T')[0]
                    }));
                    setSchemes(validatedData);
                } catch (jsonError) {
                    console.error("JSON Parsing Error:", jsonError);
                    console.log("Cleaned Response:", cleanResponse);
                    // Set empty array as fallback
                    setSchemes([]);
                }
            } catch (error) {
                console.error("Error fetching schemes:", error);
                setSchemes([]);
            } finally {
                setLoading(false);
            }
        };

        if (catagory && count) {
            fetchSchemes();
        }
    }, []);

    const filteredSchemes = schemes
        .filter((scheme) => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                scheme.title.toLowerCase().includes(searchLower) ||
                scheme.description.toLowerCase().includes(searchLower) ||
                scheme.tags.some(tag => tag.toLowerCase().includes(searchLower));
            
            const matchesState = selectedState ? scheme.state === selectedState : true;
            
            // Apply additional filters based on activeFilter
            let matchesFilter = true;
            switch (activeFilter) {
                case "Popular":
                    matchesFilter = scheme.popularity >= 4;
                    break;
                case "New":
                    matchesFilter = scheme.isNew === true;
                    break;
                case "Recently Updated":
                    matchesFilter = scheme.lastUpdated === true;
                    break;
                default:
                    matchesFilter = true;
            }
            
            return matchesSearch && matchesState && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.title.localeCompare(b.title);
            if (sortBy === "popular") return (b.popularity || 0) - (a.popularity || 0);
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });

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
                        <div className="flex-1">
                            <div className="relative max-w-2xl mx-auto">
                                <input
                                    type="text"
                                    placeholder="Search by title, description, or tags..."
                                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={loading}
                                />
                                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                )}
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
                                    onClick={() => {
                                        setSelectedState("");
                                        setSearchQuery("");
                                        setActiveFilter("All Schemes");
                                        setSortBy("name");
                                    }}
                                >
                                    Reset All
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Quick Filters */}
                                <div>
                                    <h3 className="font-medium mb-3">Quick Filters</h3>
                                    <div className="space-y-2">
                                        {["All Schemes", "Popular", "New", "Recently Updated"].map((filter) => (
                                            <label key={filter} className="flex items-center justify-between py-1 cursor-pointer group">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="quickFilter"
                                                        value={filter}
                                                        checked={activeFilter === filter}
                                                        onChange={() => setActiveFilter(filter)}
                                                        disabled={loading}
                                                        className="text-green-500 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2 text-gray-700 group-hover:text-gray-900">{filter}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* State Filter */}
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
                                            {getStateCounts().map((state) => (
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

                                {/* Sort Options */}
                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-3">Sort By</h3>
                                    <div className="space-y-2">
                                        {[
                                            { value: "name", label: "Scheme Name (A-Z)" },
                                            { value: "popular", label: "Most Popular" },
                                            { value: "newest", label: "Newest First" }
                                        ].map((option) => (
                                            <label key={option.value} className="flex items-center justify-between py-1 cursor-pointer group">
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="sort"
                                                        value={option.value}
                                                        checked={sortBy === option.value}
                                                        onChange={() => setSortBy(option.value)}
                                                        disabled={loading}
                                                        className="text-green-500 focus:ring-green-500"
                                                    />
                                                    <span className="ml-2 text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
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
                                        {searchQuery ? (
                                            <>
                                                Found <span className="text-green-500 font-semibold">{filteredSchemes.length}</span> matching schemes
                                            </>
                                        ) : (
                                            <>
                                                Total <span className="text-green-500 font-semibold">{filteredSchemes.length}</span> Schemes Available
                                            </>
                                        )}
                                    </>
                                )}
                            </h1>
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
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-sm text-gray-500">{scheme.state || "Puducherry"}</div>
                                            {scheme.isNew && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">New</span>
                                            )}
                                        </div>
                                        <h2 className="text-lg font-medium text-blue-600 mb-3">{scheme.title}</h2>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {scheme.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-3 py-1 rounded-full text-sm ${
                                                        searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase())
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
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
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedState("");
                                            setActiveFilter("All Schemes");
                                            setSortBy("name");
                                        }}
                                        className="mt-2 text-green-500 hover:text-green-600"
                                    >
                                        Clear all filters
                                    </button>
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
