import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/playnation_logo.png"; 
import userImage from "../assets/userlogo.png"; 
import { FiMenu, FiX } from "react-icons/fi"; // Icons for menu toggle

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-emerald-950 shadow-md z-50 h-20 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-6 md:px-12">
        
        {/* Logo on the left */}
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="h-16 cursor-pointer" />
          </Link>
        </div>

        {/* Hamburger Menu Button (Only on Small Screens) */}
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
          <Link to="/" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">Home</Link>
          <Link to="/turfs" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">Book</Link>
          <Link to="/about" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">About</Link>
          <Link to="/contact" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">Contact</Link>
          <Link to="/blog" className="text-white hover:text-blue-500 text-lg py-2 md:py-0 px-4 md:px-0">Blog</Link>

          {/* User Profile (No Dropdown, Directs to Login) */}
          <Link to="/login" className="py-2 md:py-0">
            <img
              src={userImage}
              alt="User"
              className="h-8 w-8 rounded-full cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
