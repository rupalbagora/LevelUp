import React, { useEffect, useState } from "react";
import { ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const languages = [
  "JavaScript", "Python", "C++", "Java",
  "Go", "Rust", "TypeScript", "Kotlin",
  "Swift", "Solidity", "PHP", "Dart"
];

const HeroSection = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({
        x: (e.clientX - window.innerWidth / 2) * 0.01,
        y: (e.clientY - window.innerHeight / 2) * 0.01,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-[#050816] transition-colors duration-500 flex flex-col justify-center">

      {/* 🔵 Bottom Blue Glow */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
          w-full max-w-[1200px] h-[50%] 
          bg-[radial-gradient(circle_at_center_bottom,_rgba(37,99,235,0.6)_0%,_transparent_70%)]
          blur-3xl opacity-70">
        </div>
      </div>

      {/* 🎯 RESPONSIVE RINGS (Bottom-Up Scaling) */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
        <div className="relative w-full max-w-[1000px] aspect-[2/1] overflow-hidden">
          <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-full opacity-40 md:opacity-100"
          >
            <circle cx="500" cy="500" r="200" stroke="currentColor" className="text-gray-400 dark:text-white/10" strokeWidth="1" fill="none" strokeDasharray="6 6" />
            <circle cx="500" cy="500" r="300" stroke="currentColor" className="text-gray-400 dark:text-white/10" strokeWidth="1" fill="none" strokeDasharray="6 6" />
            <circle cx="500" cy="500" r="400" stroke="currentColor" className="text-gray-500 dark:text-white/20" strokeWidth="1" fill="none" strokeDasharray="6 6" />
          </svg>
        </div>
      </div>

      {/* MOVING STARS */}
      <motion.img
        src="https://cdn.prod.website-files.com/67bc0582a9859fa021751c94/6874990bd18cf6ec4041ae6b_stars.svg"
        alt="stars"
        style={{ x: pos.x, y: pos.y }}
        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-50 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        {/* Original Badge Style */}
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-white/5 px-5 py-2 border border-purple-200 dark:border-white/10 text-sm text-[#7000ff] dark:text-cyan-400 font-bold mb-8 backdrop-blur-lg">
          <Zap size={14} fill="currentColor" /> THE NEXT GEN ARENA
        </div>

        {/* 🎯 RESTORED FONT SIZES (5xl for mobile, 7xl for desktop) */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-tight">
          Code. Compete. <br />
          <span className="gradient-text">
            Conquer.
          </span>
        </h1>

        {/* Original Subtext Size */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed">
          Join 10,000+ developers in real-time coding battles.
        </p>

        {/* Original Button Scaling */}
        <button className="group relative flex items-center mx-auto cursor-pointer">
          <span className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 blur-md" />
          <span className="relative flex items-center rounded-full pl-1 pr-8 py-1.5 border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0b0f1f] transition duration-300">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gradient-to-br dark:from-white dark:to-gray-300 text-black shadow-inner transition duration-300 group-hover:scale-110">
              <ChevronRight size={20} />
            </span>
            <span className="ml-4 font-semibold text-lg tracking-wide text-gray-900 dark:text-white">Get Started</span>
          </span>
        </button>
      </div>

      {/* Languages Marquee */}
      <div className="absolute bottom-[60px] md:bottom-[80px] w-full flex justify-center pointer-events-none">
        <div className="relative w-full max-w-[320px] sm:max-w-[600px] md:max-w-[900px] overflow-hidden px-4">
          <div
            className="absolute inset-0 z-10"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            }}
          />
          <div className="animate-marquee whitespace-nowrap text-xl md:text-2xl font-bold text-gray-400 dark:text-white/20 flex gap-12 md:gap-16 pt-8">
            {languages.concat(languages).map((lang, i) => (
              <span key={i}>{lang}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </section>
  );
};

export default HeroSection;