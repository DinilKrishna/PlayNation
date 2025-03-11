import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import signupImage from '../../assets/turf.jpeg'; // Importing the left-side image

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    // Add signup logic here (API call, validation, etc.)
    console.log('Signup successful:', formData);
    navigate('/login'); // Redirect to login after successful signup
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 relative overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-center gap-12 m-10">
        
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2">
          <img src={signupImage} alt="Signup Illustration" className="w-full rounded-lg shadow-md" />
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 bg-gray-100 p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-green-600 mb-6">Signup</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Buttons */}
            <div className="flex justify-around">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md w-full mx-5"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md w-full mx-5"
              >
                Signup
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Signup;
