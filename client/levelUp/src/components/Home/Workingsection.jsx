import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const WorkingSection = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.15], [0.8, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 1, 0]);

  // Line animation starts later and ends precisely
  const lineHeight = useSpring(useTransform(scrollYProgress, [0.2, 0.95], ["0%", "100%"]), {
  stiffness: 100,
  damping: 30,
});

  const sideSteps = [
    { side: "left", title: "Step 01", desc: "Browse our massive library of DSA challenges and select one level of difficulty." },
    { side: "right", title: "Step 02", desc: "Generate a link and share to your friend by whom you want to compete." },
    { side: "left", title: "Step 03", desc: "Built your logic and then code it and track your friend while coding." },
    { side: "right", title: "Step 04", desc: "Submit your solution in real-time. Watch the leaderboard update as you climb to the top!" },
  ];

  return (
    // Height reduced for better flow on mobile (380vh -> 300vh)
    
    <div ref={containerRef} className="relative h-[260vh] md:h-[330vh] bg-white dark:bg-[#060910]">
      
      {/* PHASE 1: Text Zoom */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pointer-events-none">
        <motion.h2 
          style={{ scale, opacity }}
          className="text-5xl md:text-9xl font-black text-[#7000ff] dark:text-white text-center px-4"
        >
          HOW IT WORKS
        </motion.h2>
      </div>

      {/* PHASE 2: Growing Line & Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 -mt-[30vh] md:-mt-[20vh]">
        
        {/* The Vertical Center Line (Hidden on small mobile if needed, or kept thin) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-[100px] w-[2px] md:w-[3px] bg-slate-100 dark:bg-white/5">
          <motion.div 
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-[#7000ff] via-[#00d4ff] to-cyan-400 origin-top shadow-[0_0_20px_#7000ff]"
          />
        </div>

        {/* Steps Content */}
        <div className="space-y-[15vh] md:space-y-[20vh] pt-[50vh] md:pt-[60vh] pb-40 md:pb-60">
          {sideSteps.map((step, index) => (
            <div key={index} className={`flex w-full items-center ${step.side === "left" ? "md:justify-start" : "md:justify-end"} justify-center`}>
              
              <motion.div 
                initial={{ opacity: 0, x: step.side === "left" ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-10%", once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                // Responsive width: 90% on mobile, 45% on desktop
                className="w-[90%] md:w-[45%] p-6 md:p-10 rounded-[25px] md:rounded-[35px] bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-2xl relative z-20"
              >
                {/* Connection Dot - Hidden on small mobile to avoid layout breaking */}
                <div className={`hidden md:block absolute top-1/2 ${step.side === "left" ? "-right-[calc(11.1%+10px)]" : "-left-[calc(11.1%+10px)]"} w-4 h-4 rounded-full bg-[#7000ff] shadow-[0_0_15px_#7000ff] -translate-y-1/2`}></div>

                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 md:mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkingSection;