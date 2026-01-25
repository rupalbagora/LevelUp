import React from "react";
import { ChevronRight } from "lucide-react";
import heroSection from "../../assets/heroSection2.webp";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 pt-24 text-center">
        {/* Badge */}
        <p className="inline-block rounded-full bg-blue-50 px-5 py-2 text-blue-500 border border-blue-200 text-sm mb-6">
          ✨ The Ultimate Coding Battle Platform
        </p>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          Code. Compete. Conquer.
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
          Join thousands of developers in real-time coding battles. Master data
          structures and algorithms while competing with friends and climbing
          the global leaderboard.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link to="signin" className="flex items-center gap-2 bg-blue-700 text-white font-medium rounded-xl px-6 py-3 hover:bg-blue-800 transition">
            Get Started Free
            <ChevronRight className="w-4 h-4" />
          </Link>

          <button className="border border-gray-300 rounded-xl px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 transition">
            View Demo
          </button>
        </div>

        {/* Hero Image */}
        <div className="mt-14 flex justify-center my-5">
          <img
            src={heroSection}
            alt="Platform preview"
            className="w-full max-w-4xl rounded-2xl h-[500px] shadow-2xl shadow-gray-800"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
