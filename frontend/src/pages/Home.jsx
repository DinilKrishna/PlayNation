import React from "react";
import { Link } from "react-router-dom";
import background from "../assets/turfimage.jpeg";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div 
      className="min-h-screen w-full flex flex-col relative overflow-hidden" // No horizontal scroll
      style={{ 
        backgroundImage: `url(${background})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh"
      }}
    >
      <Navbar />

      <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-6 px-6 md:px-12 bg-black/50 p-6 text-center md:text-left">
        {/* Left Content - Welcome Message */}
        <div className="text-white max-w-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Welcome to PlayNation
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">
            Your favourite playground is just a tap away.
          </p>
        </div>

        {/* Right Content - Booking Button (Stacked on Small Screens) */}
        <Link to="/turfs">
          <button className="bg-green-500 hover:bg-green-700 cursor-pointer text-white font-bold py-3 px-6 rounded-lg text-base sm:text-lg shadow-lg mt-4 md:mt-0">
            Book Your Spot Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
