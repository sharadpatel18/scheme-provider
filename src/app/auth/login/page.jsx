"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode"; // Install using: npm install jwt-decode


export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Store token in localStorage (or use cookies for better security)
      localStorage.setItem("token", data.token);
      const decodedToken = jwtDecode(data.token);
      localStorage.setItem("user", JSON.stringify(decodedToken));
      alert("Login successful!");
      router.push("/"); // Redirect after login
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}

        <div className="mt-4">
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full px-4 py-2 mb-3 border rounded-md" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full px-4 py-2 mb-3 border rounded-md" />
        </div>

        <button onClick={handleLogin} className="w-full px-6 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-700">
          Login
        </button>

        {/* Redirect Buttons */}
        <div className="mt-6 text-center">
          <button onClick={() => router.push("/auth/signup")} className="text-blue-600 hover:underline">
            Don't have an account? Sign Up
          </button>
        </div>
        <div className="mt-2 text-center">
          <button onClick={() => router.push("/forgot-password")} className="text-red-600 hover:underline">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
