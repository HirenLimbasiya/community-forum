// HomePage.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Image from "next/image";
import groupChatSvg from "../images/undraw_group_chat_re_frmo.svg"

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // Access login and isAuthenticated from AuthContext
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/topic"); // Redirect if already authenticated
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gradient-to-r from-light to-softBlue">
      <div className="text-center max-w-lg p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-5xl font-extrabold text-darkBlue mb-4">
          Welcome to Community Forum
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Join discussions on various topics or create your own to share with
          others!
        </p>
        <div className="mb-6">
          <Image
            src={groupChatSvg}
            alt="Group chat"
            className="mx-auto rounded-lg shadow-md"
            // Add width and height attributes if needed
          />
        </div>
        <Link
          href="/register"
          className="text-md font-semibold text-white bg-darkBlue hover:bg-navy py-3 px-8 rounded-full transition duration-300 transform hover:scale-105"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
