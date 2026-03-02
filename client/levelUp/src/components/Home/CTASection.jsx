import React from "react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="relative pt-0 md:pt-28 pb-24 px-6 z-30 transition-colors duration-500 bg-white dark:bg-[#060910]">

      <div className="max-w-3xl mx-auto text-center">

        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">
          Ready to{" "}
          <span className="bg-gradient-to-r from-[#7000ff] to-[#00d4ff] bg-clip-text text-transparent">
            Level Up?
          </span>
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-10 leading-relaxed">
          Don't just code, compete and win. Join the elite league of developers today.
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="
            relative px-8 sm:px-12 py-4
            rounded-xl font-bold tracking-wide uppercase
            bg-slate-900 text-white
            dark:bg-white dark:text-black
            transition-all duration-300
            shadow-lg group
          "
        >
          <span className="relative z-10">
            Create Free Account
          </span>

          <span className="
            absolute inset-0 rounded-xl
            bg-gradient-to-r from-[#7000ff] to-[#00d4ff]
            opacity-0 group-hover:opacity-20
            transition duration-500
          " />
        </motion.button>

      </div>
    </section>
  );
};

export default CTASection;