import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import JobSearch from "./components/JobSearch";
import SignUp from "./components/SingUp";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Admin from "./Admin";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    // Make sure we're storing the user data correctly
    console.log("Login response:", userData);
    setUser(userData.user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/JobSearch" element={<JobSearch user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route 
            path="/profile" 
            element={<Profile user={user} />} 
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;