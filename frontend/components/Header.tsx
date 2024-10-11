"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveLink = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <header className="bg-light border-b border-softBlue py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 h-16">
        {/* Logo */}
        <Link href="/topic" className="text-2xl font-bold text-navy">
          Community Forum
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
            className="text-navy focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <Link
                href="/topic"
                className={`text-md font-medium transition ${
                  isActiveLink("/topic")
                    ? "text-darkBlue font-semibold border-b-2 border-darkBlue"
                    : "text-gray-700 hover:text-darkBlue"
                }`}
              >
                Topics
              </Link>
              <Link
                href="/profile"
                className={`text-md font-medium transition ${
                  isActiveLink("/profile")
                    ? "text-darkBlue font-semibold border-b-2 border-darkBlue"
                    : "text-gray-700 hover:text-darkBlue"
                }`}
              >
                Profile
              </Link>
            </>
          )}

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-md font-medium text-white bg-darkBlue hover:bg-navy py-2 px-4 rounded-lg shadow-md transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-md font-medium text-white bg-darkBlue hover:bg-navy py-2 px-4 rounded-lg shadow-md transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col justify-between p-6 md:hidden transition-transform transform translate-x-0 shadow-lg">
            {/* Close Icon */}
            <div className="absolute top-4 left-4">
              <button
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
                className="text-navy"
              >
                <FiArrowLeft size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center space-y-6 flex-grow">
              <Link
                href="/topic"
                className={`text-lg font-medium transition ${
                  isActiveLink("/topic")
                    ? "text-darkBlue font-semibold"
                    : "text-gray-700 hover:text-darkBlue"
                }`}
                onClick={toggleMobileMenu}
              >
                Topics
              </Link>
              <Link
                href="/profile"
                className={`text-lg font-medium transition ${
                  isActiveLink("/profile")
                    ? "text-darkBlue font-semibold"
                    : "text-gray-700 hover:text-darkBlue"
                }`}
                onClick={toggleMobileMenu}
              >
                Profile
              </Link>
            </nav>

            {/* Auth Button */}
            <div className="mt-auto">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="text-md font-medium text-white bg-darkBlue hover:bg-navy py-2 px-4 w-full rounded-lg shadow-md transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-md font-medium text-white bg-darkBlue hover:bg-navy py-2 px-4 w-full rounded-lg shadow-md transition"
                  onClick={toggleMobileMenu}
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
