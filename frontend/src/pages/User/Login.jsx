import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import loginImage from '../../assets/turf.jpeg';
import axiosInstance from '../../api/axios';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try { 
      const response = await axiosInstance.post('/user/login/', formData);
      
      if (response.data.access) {
        useAuthStore.getState().setTokens(
          response.data.access,
          response.data.refresh,
          3600 // Token expiration time in seconds
        );
        navigate("/turfs");
      } else {
        setError(response.data.error || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.detail || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 relative overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-center gap-12 my-10">
        {/* Login Form */}
        <div className="w-full md:w-1/2 bg-gray-100 p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-green-600 mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-gray-700">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-green-500 hover:underline">
              Click here to signup
            </Link>
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <img src={loginImage} alt="Login Illustration" className="w-full rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default Login;