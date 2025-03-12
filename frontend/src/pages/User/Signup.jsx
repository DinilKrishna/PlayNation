import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import signupImage from '../../assets/turf.jpeg';
import { registerUser } from "../../api/auth"; // Import API function

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
        const response = await axios.post("http://localhost:8000/api/user/register/", formData);
        alert(response.data.message); // Show success message
        navigate("/login"); // Redirect to login page after successful signup
    } catch (error) {
        if (error.response && error.response.data) {
            const errors = error.response.data;
            if (typeof errors === "string") {
                setErrorMessage(errors); // For generic error messages
            } else if (errors.email) {
                setErrorMessage(errors.email[0]); // Show specific email error
            } else if (errors.username) {
                setErrorMessage(errors.username[0]);
            } else if (errors.password) {
                setErrorMessage(errors.password[0]);
            } else if (errors.confirm_password) {
                setErrorMessage(errors.confirm_password[0]);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } else {
            setErrorMessage(error.message || "Some error occurred.");
        }
    }
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
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            {/* Error Message */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

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
