import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import loginImage from '../../assets/turf.jpeg';
import axiosInstance from '../../api/axios';
import useAuthStore from '../../store/authStore';

const AdminLogin = () => {
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
      const response = await axiosInstance.post('/admin/login/', formData);
      
      if (response.data.access) {
        if (!response.data.user.is_staff) {
          setError("Unauthorized: Not an admin.");
          return;
        }
  
        useAuthStore.getState().setTokens(
          response.data.access,
          response.data.refresh,
          3600 // Token expiration time in seconds
        );
  
        navigate("/admindashboard");
      } 
    } catch (error) {
      console.error("Login Error:", error);
  
      // Display the exact error from the backend
      setError(error.response?.data?.detail || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-center gap-12 my-10">
        {/* Login Form */}
        <div className="w-full md:w-1/2 bg-gray-800 p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-yellow-500 mb-6">Admin Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-500 p-3 rounded-md mb-4 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-500 p-3 rounded-md mb-4 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            {error && <p className="text-red-400 mb-4">{error}</p>}

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg shadow-md"
            >
              Login
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2">
          <img src={loginImage} alt="Admin Login Illustration" className="w-full rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
