"use client";

import { useContext, useState, useEffect } from "react";
import { SchemeContext } from "@/context/SchemeProvider";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SchemeDetails = () => {
  const { selectedSchemes } = useContext(SchemeContext);
  const [activeTab, setActiveTab] = useState("Details");
  const [enrichedData, setEnrichedData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Details",
    "Benefits",
    "Eligibility",
    "Application Process",
    "Documents Required",
    "Frequently Asked Questions",
    "Sources And References"
  ];

  useEffect(() => {
    const fetchEnrichedData = async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Given this government scheme: "${selectedSchemes?.title}"
        
        Create a comprehensive and detailed analysis of this scheme with the following structure. Make sure to provide extensive, realistic, and accurate information for each section:

        1. DETAILED DESCRIPTION:
        - Provide a thorough explanation of the scheme (at least 2-3 paragraphs)
        - Include the implementing agency/department
        - Mention the year of launch and any significant modifications
        - Explain the scheme's objectives and goals
        - Describe the scheme's importance and impact

        2. BENEFITS:
        - List all monetary benefits with exact amounts
        - Include non-monetary benefits
        - Specify any special benefits for different categories
        - Mention duration and frequency of benefits
        - Include any additional perks or advantages

        3. ELIGIBILITY CRITERIA:
        - List all eligibility conditions in detail
        - Include age limits if any
        - Specify income criteria if applicable
        - Mention geographical restrictions
        - List any documentation prerequisites
        - Include any special category considerations

        4. APPLICATION PROCESS:
        - Provide step-by-step application procedure
        - Include both online and offline application methods
        - List all required forms and their availability
        - Mention application deadlines if any
        - Include processing time
        - List verification steps

        5. DOCUMENTS REQUIRED:
        - List all mandatory documents
        - Include format specifications for each document
        - Mention any special certification requirements
        - Include validity requirements for documents
        - List supporting documents that may be needed

        6. FREQUENTLY ASKED QUESTIONS:
        - Create at least 4 relevant FAQs
        - Include questions about eligibility
        - Address common application issues
        - Include questions about benefit disbursement
        - Address scheme-specific concerns

        7. SOURCES AND REFERENCES:
        - List official government websites
        - Include relevant ministry/department contacts
        - Provide helpline numbers if available
        - List regional office addresses
        - Include important links and resources

        Return the response in JSON format with these exact keys:
        {
          "detailed_description": "string with paragraphs",
          "benefits": ["array of detailed benefits"],
          "eligibility": ["array of detailed criteria"],
          "application_process": {
            "steps": ["array of detailed steps"],
            "online_process": ["array of online steps"],
            "offline_process": ["array of offline steps"]
          },
          "documents_required": ["array of detailed document requirements"],
          "faqs": [{"question": "string", "answer": "string"}],
          "sources": ["array of sources and references"]
        }

        Make sure all information is detailed, realistic, and properly formatted. Do not include any special characters or control characters in the response.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        
        // Clean the response
        let cleanResponse = response
          .replace(/```json|```/g, "") // Remove markdown code blocks
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
          .replace(/\n/g, " ") // Replace newlines with spaces
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .trim();

        try {
          const parsedData = JSON.parse(cleanResponse);
          setEnrichedData(parsedData);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          // Fallback data in case of parsing error
          setEnrichedData({
            detailed_description: "Unable to load scheme details. Please try again later.",
            benefits: ["Information temporarily unavailable"],
            eligibility: ["Information temporarily unavailable"],
            application_process: {
              steps: ["Information temporarily unavailable"],
              online_process: ["Information temporarily unavailable"],
              offline_process: ["Information temporarily unavailable"]
            },
            documents_required: ["Information temporarily unavailable"],
            faqs: [{
              question: "Why am I seeing this message?",
              answer: "There was an error loading the scheme details. Please try again later."
            }],
            sources: ["Information temporarily unavailable"]
          });
        }
      } catch (error) {
        console.error("Error fetching enriched data:", error);
        setEnrichedData({
          detailed_description: "Unable to load scheme details. Please try again later.",
          benefits: ["Information temporarily unavailable"],
          eligibility: ["Information temporarily unavailable"],
          application_process: {
            steps: ["Information temporarily unavailable"],
            online_process: ["Information temporarily unavailable"],
            offline_process: ["Information temporarily unavailable"]
          },
          documents_required: ["Information temporarily unavailable"],
          faqs: [{
            question: "Why am I seeing this message?",
            answer: "There was an error loading the scheme details. Please try again later."
          }],
          sources: ["Information temporarily unavailable"]
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedSchemes?.title) {
      fetchEnrichedData();
    }
  }, [selectedSchemes]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "Details":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="prose max-w-none text-gray-600">
              {enrichedData?.detailed_description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        );
      case "Benefits":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>
            <ul className="space-y-3">
              {enrichedData?.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "Eligibility":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
            <ul className="space-y-3">
              {enrichedData?.eligibility.map((criteria, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600 leading-relaxed">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "Application Process":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Application Process</h2>
            <div className="flex gap-4 mb-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Offline</button>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md">Online</button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3 text-lg">Online Application Steps:</h3>
                <ol className="space-y-3 list-decimal pl-4">
                  {enrichedData?.application_process.online_process.map((step, idx) => (
                    <li key={idx} className="text-gray-600 leading-relaxed pl-2">{step}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-medium mb-3 text-lg">Offline Application Steps:</h3>
                <ol className="space-y-3 list-decimal pl-4">
                  {enrichedData?.application_process.offline_process.map((step, idx) => (
                    <li key={idx} className="text-gray-600 leading-relaxed pl-2">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        );
      case "Documents Required":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Documents Required</h2>
            <ul className="space-y-3">
              {enrichedData?.documents_required.map((doc, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600 leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "Frequently Asked Questions":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {enrichedData?.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                  <h3 className="font-medium text-gray-900 mb-2">Q: {faq.question}</h3>
                  <p className="text-gray-600">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "Sources And References":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sources And References</h2>
            <ul className="space-y-3">
              {enrichedData?.sources.map((source, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600 leading-relaxed">{source}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return (
          <div className="text-gray-600">
            Content for {activeTab} will be displayed here.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/schemes-section/schemelist" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-1">Back</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Location and Title */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Puducherry</div>
          <h1 className="text-2xl font-semibold text-blue-600">{selectedSchemes?.title || "Scheme Details"}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedSchemes?.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation and Content */}
        <div className="flex gap-6">
          {/* Left Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm">
              <nav className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-left hover:bg-gray-50 ${
                      activeTab === tab
                        ? "text-blue-600 border-l-4 border-blue-600 bg-blue-50 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;
