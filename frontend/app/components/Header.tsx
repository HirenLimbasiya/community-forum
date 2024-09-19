"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Import the Auth context
import { FiMenu, FiX, FiArrowLeft } from "react-icons/fi"; // Icons for mobile menu

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth(); // Get authentication status and logout function
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const isActiveLink = (path: string) => pathname === path;

  const handleLogout = () => {
    logout(); // Use the logout function from the context
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 h-16 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 h-full">
        <Link href="/" className="text-2xl font-semibold text-gray-800">
          MyApp
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-800">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
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

        {/* Auth Buttons for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-md font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-md font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Full-height Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white flex flex-col justify-between p-6 md:hidden">
            {/* Close/Back button at the top-left */}
            <div className="absolute top-4 left-4">
              <button onClick={toggleMobileMenu} className="text-gray-800">
                <FiArrowLeft size={24} />
              </button>
            </div>

            {/* Centered Links */}
            <nav className="flex flex-col items-center space-y-6 flex-grow">
              <Link
                href="/topic"
                className={`text-lg font-medium transition ${
                  isActiveLink("/topic")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                Topics
              </Link>
              <Link
                href="/profile"
                className={`text-lg font-medium transition ${
                  isActiveLink("/profile")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                Profile
              </Link>
            </nav>

            {/* Logout/Login Button at the bottom */}
            <div className="mt-auto">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-md font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 w-full rounded transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-md font-medium text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 w-full rounded transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
