"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Import the Auth context

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth(); // Get authentication status and logout function

  // Function to check if the link is active
  const isActiveLink = (path: string) => pathname === path;

  const handleLogout = () => {
    logout(); // Use the logout function from the context
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 h-16 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 h-full">
        <Link href="/" className="text-2xl font-semibold text-gray-800">
          MyApp
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-6">
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
        ) : (
          <Link
            href="/login"
            className="text-md font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
