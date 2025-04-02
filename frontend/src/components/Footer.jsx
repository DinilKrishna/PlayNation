import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/playnation_logo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-emerald-950 text-white pt-12 pb-6">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-start">
            <Link to="/" className="mb-4">
              <img src={logo} alt="Logo" className="h-16 cursor-pointer" />
            </Link>
            <p className="text-gray-300 mb-4">
              PlayNation is your premier destination for turf bookings and sports facilities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-emerald-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white cursor-pointer transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/turfs" className="text-gray-300 hover:text-white cursor-pointer transition">
                  Book a Turf
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white cursor-pointer transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white cursor-pointer transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white cursor-pointer transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-emerald-700 pb-2">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-emerald-400"></i>
                <span className="cursor-pointer hover:text-white">
                  123 Sports Avenue, Cityville, ST 12345
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3 text-emerald-400"></i>
                <span className="cursor-pointer hover:text-white">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-emerald-400"></i>
                <span className="cursor-pointer hover:text-white">
                  info@playnation.com
                </span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-clock mt-1 mr-3 text-emerald-400"></i>
                <span className="cursor-pointer hover:text-white">
                  Mon-Sun: 6:00 AM - 10:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-emerald-700 pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-800"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-r-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-emerald-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} PlayNation. All rights reserved. | 
            <Link to="/privacy" className="ml-2 hover:text-white cursor-pointer">
              Privacy Policy
            </Link> | 
            <Link to="/terms" className="ml-2 hover:text-white cursor-pointer">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;