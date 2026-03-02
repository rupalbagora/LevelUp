import React from 'react'
import Navbar from './components/layout/Navbar';
import Home from './components/Home/Home';
import {Routes,Route} from "react-router-dom"
import Auth from './components/auth/Auth';
import DashboardLayout from './components/Dashboard/DashboardLayout';
const App = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </div>
  );
}

export default App
