"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemeContext } from "@/context/SchemeProvider";

const SchemeDetails = () => {
  const [scheme, setScheme] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(true);
    const {selectedSchemes} = useContext(SchemeContext);
  useEffect(() => {

    const fetchSchemeDetails = async () => {
      try {
        const genAI = new GoogleGenerativeAI(
          process.env.NEXT_PUBLIC_GEMINI_API_KEY
        );
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Parse incoming scheme data
        // let userScheme;
        // try {
        //   userScheme = JSON.parse(decodeURIComponent(schemeData));
        // } catch (error) {
        //   console.error("Error parsing scheme data:", error);
        //   setLoading(false);
        //   return;
        // }

        // Gemini AI prompt to enhance scheme details
        const prompt = `
        Given the following scheme details:

        ${JSON.stringify(selectedSchemes, null, 2)}

        Return a JSON object that includes:
        {
          "title": "Detailed Scheme Title",
          "tags": ["Relevant Tag1", "Tag2"],
          "description": "An enriched description with additional details",
          "benefits": "Expanded benefits explanation",
          "eligibility": ["Eligibility criteria 1", "Eligibility criteria 2", "More criteria"],
          "application_process": "How to apply step by step",
          "documents_required": ["Document1", "Document2"],
          "online": true/false,
          "formLink": "https://example.com",
          "test_questions": [
            { "question": "Do you have a valid Aadhaar card?", "type": "boolean" },
            { "question": "What is your annual income?", "type": "numeric", "criteria": "Must be below 2 lakhs" },
            { "question": "Are you a resident of India?", "type": "boolean" }
          ]
        }
        Ensure the response is only valid JSON.
        `;

        const result = await model.generateContent(prompt);
        let response = await result.response.text();

        // Remove Markdown (```json ... ```) if present
        response = response.replace(/```json|```/g, "").trim();

        let parsedData;
        try {
          parsedData = JSON.parse(response);
          setScheme(parsedData);
        } catch (error) {
          console.error("Invalid AI response format:", response);
        }
      } catch (error) {
        console.error("Error fetching scheme details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemeDetails();
  }, []);

  const checkEligibility = () => {
    if (!scheme?.test_questions) return;
    const answers = scheme.test_questions.map((q) => {
      if (q.type === "boolean") {
        return { question: q.question, answer: Math.random() < 0.5 ? "Yes" : "No" };
      } else if (q.type === "numeric") {
        return { question: q.question, answer: "1,50,000" };
      }
      return { question: q.question, answer: "N/A" };
    });

    setEligibilityResult(answers);
  };

  if (loading) return <p className="text-center text-gray-500">Loading scheme details...</p>;
  if (!scheme) return <p className="text-center text-red-500">Scheme not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">{scheme.title}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        {scheme.tags.map((tag, index) => (
          <span key={index} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Details</h2>
        <p className="text-gray-700">{scheme.description}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Benefits</h2>
        <p className="text-gray-700">{scheme.benefits}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Eligibility</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {scheme.eligibility.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Documents Required</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {scheme.documents_required.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Application Process</h2>
        <p className="text-gray-700">{scheme.application_process}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-lg font-semibold">Application Link</h2>
        {scheme.online ? (
          <a
            href={scheme.formLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 font-medium hover:underline"
          >
            Apply Online
          </a>
        ) : (
          <p className="text-red-600 font-medium">Participate Offline</p>
        )}
      </section>

      {/* Eligibility Test */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Eligibility Test</h2>
        {eligibilityResult ? (
          <div className="mt-2 p-4 border rounded-md bg-gray-100">
            {eligibilityResult.map((q, index) => (
              <p key={index}>
                <strong>{q.question}:</strong> {q.answer}
              </p>
            ))}
          </div>
        ) : (
          <button
            onClick={checkEligibility}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Check Eligibility
          </button>
        )}
      </section>
    </div>
  );
};

export default SchemeDetails;
