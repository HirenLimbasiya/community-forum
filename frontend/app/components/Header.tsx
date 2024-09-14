"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Function to check if the link is active
  const isActiveLink = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/topic" className="text-2xl font-semibold text-gray-800">
          MyApp
        </Link>

        <nav className="flex space-x-6">
          <Link
            href="/topic"
            className={`text-md font-medium transition ${
              isActiveLink("/topic")
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            Topics
          </Link>
          <Link
            href="/profile"
            className={`text-md font-medium transition ${
              isActiveLink("/profile")
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            Profile
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-md font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
