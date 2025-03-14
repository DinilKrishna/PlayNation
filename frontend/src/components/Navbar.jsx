import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/playnation_logo.png";
import userImage from "../assets/userlogo.png";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-emerald-950 shadow-md z-50 h-20 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="h-16 cursor-pointer" />
        </Link>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navbar Links */}
        <div
          className={`absolute md:relative top-20 left-0 w-full md:w-auto bg-black/90 md:bg-transparent flex flex-col md:flex-row items-center md:space-x-8 md:top-0 md:flex ${
            isMenuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <Link to="/" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">
            Home
          </Link>
          <Link to="/turfs" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">
            Book
          </Link>
          <Link to="/about" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">
            About
          </Link>
          <Link to="/contact" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">
            Contact
          </Link>
          <Link to="/blog" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">
            Blog
          </Link>

          {/* User Profile Section */}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 py-2 md:py-0 cursor-pointer"
              >
                <img src={userImage} alt="User" className="h-8 w-8 rounded-full cursor-pointer" />
                <FiChevronDown className="text-white text-lg" />
              </button>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-emerald-700 text-white shadow-lg rounded-lg border border-gray-700">
                  <Link
                    to="/userprofile"
                    className="block px-4 py-3 text-sm hover:bg-emerald-900 rounded-t-lg transition"
                  >
                    User Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm bg-red-600/10  hover:bg-emerald-900 rounded-b-lg transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="py-2 md:py-0">
              <img src={userImage} alt="User" className="h-8 w-8 rounded-full cursor-pointer" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
