import React from "react";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;

