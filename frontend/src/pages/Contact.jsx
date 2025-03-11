import React from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <div className='min-h-screen w-full flex flex-col relative overflow-hidden bg-white'>
    <div className="min-h-screen w-full text-gray-800">
      <Navbar />
      <div className="container mx-auto px-6 py-16 text-center my-10">
        <h1 className="text-4xl font-bold text-green-400 mb-6">Contact Us</h1>
        <p className="text-lg text-black max-w-2xl mx-auto mb-6">
          Have questions? Need support? Reach out to us via email or phone, and we'll be happy to assist you.
        </p>
        <div className="text-lg">
          📧 <a href="mailto:support@playnation.com" className="text-green-400 hover:underline">support@playnation.com</a><br />
          📞 <a href="tel:+1234567890" className="text-green-500 hover:underline">+1 234 567 890</a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Contact;
