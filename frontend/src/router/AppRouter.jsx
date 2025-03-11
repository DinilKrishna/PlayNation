import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/User/Home";
import About from "../pages/User/About";
import Contact from "../pages/User/Contact";
import Blog from "../pages/User/Blog";
import Turfs from "../pages/User/Turfs";
import Login from "../pages/User/Login";
import Signup from "../pages/User/Signup";
import React from "react";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turfs" element={<Turfs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
