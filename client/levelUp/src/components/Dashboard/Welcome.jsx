import React from "react";
import { Swords } from "lucide-react";
const Welcome = () => {
  return (
    <div className="bg-blue-600 text-white rounded-xl shadow-xl p-6 px-10 flex items-center justify-between my-10">
      {/* Left content */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back, Rupal! 👋</h2>
        <p className="text-blue-100">Ready to start your next challenge?</p>
      </div>

      {/* Right button */}
      <button className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
        <Swords /> Start New Battle
      </button>
    </div>
  );
};

export default Welcome;
