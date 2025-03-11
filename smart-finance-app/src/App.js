import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Smart Personal Finance App</h1>
      <p>Track your expenses, set budgets, and manage finances smartly.</p>
      <button onClick={handleGetStarted}>Get Started</button>
    </div>
  );
};

const App = () => {
  const token = localStorage.getItem('token'); // ✅ JWT Token Check

  return (
    <Router>
      <Routes>
        {/* ✅ Home Page */}
        <Route path="/" element={<Home />} />

        {/* ✅ Login Page */}
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />

        {/* ✅ Signup Page */}
        <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* ✅ Dashboard Page (Protected Route) */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />

        {/* ✅ Any Unknown Route will Redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;