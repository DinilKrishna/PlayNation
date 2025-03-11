import React from "react";
import Navbar from "../components/Navbar";

const Blog = () => {
  return (
    <div className='min-h-screen w-full flex flex-col relative overflow-hidden'>
    <div className="min-h-screen w-full text-gray-800">
      <Navbar />
      <div className="container mx-auto px-6 py-16 text-center my-10">
        <h1 className="text-4xl font-bold text-green-400 mb-6">Our Blog</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Stay updated with the latest trends in sports, fitness tips, and PlayNation updates. 
          Read our expert articles on improving your game and staying fit!
        </p>
      </div>
    </div>
    </div>
  );
};

export default Blog;
