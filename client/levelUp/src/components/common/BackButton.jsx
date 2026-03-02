import React from 'react'
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
const BackButton = () => {
   const navigate = useNavigate(); 
  return (
    <div
      className="flex absolute top-1/7 left-10 cursor-pointer gap-4"
      onClick={() => navigate("/")}
    >
      <ArrowLeft className="text-gray-600 " /> Back
    </div>
  );
}

export default BackButton
