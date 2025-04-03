import React from "react";
import { Link } from "react-router-dom";
import background from "../../assets/turfimage.jpeg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed background */}
      <div 
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ 
          backgroundImage: `url(${background})`, 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* Semi-transparent overlay */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black/50" />
      
      <Navbar />

      {/* Main content - flex-grow will push footer down */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-60 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome Message */}
          <div className="text-white mb-8 px-2 sm:px-4">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 break-words">
              Welcome to PlayNation
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 break-words whitespace-normal max-w-full">
              Your favourite playground is just a tap away.
            </p>
          </div>

          {/* Booking Button */}
          <Link to="/turflist">
            <button className="bg-green-500 hover:bg-green-700 cursor-pointer text-white font-bold py-3 px-6 rounded-lg text-sm sm:text-base md:text-lg shadow-lg transition">
              Book Your Spot Now
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;