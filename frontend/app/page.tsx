// HomePage.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // Access login and isAuthenticated from AuthContext
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/topic"); // Redirect if already authenticated
    }
  }, [isAuthenticated]);
  return (
    <div>
      <Header />
      <HeroSection />
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to MyApp
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Join us to explore and share your topics.
        </p>
        <Link
          href="/register"
          className="text-md font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded transition"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
