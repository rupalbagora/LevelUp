import React, { useEffect, useState, useRef } from "react";

const Counter = ({ end, suffix = "", startCounting }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let start = 0;
    const duration = 2000; // total animation time (2s)
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, startCounting]);

  return (
    <h2 className="text-4xl sm:text-5xl font-black text-white mb-2">
      {count.toLocaleString()}
      {suffix}
    </h2>
  );
};

const StatsSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.4 } // 40% visible hone par trigger
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0d121d] py-20 sm:py-24 border-y border-white/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16 text-center">
          {[
            { end: 10000, suffix: "+", label: "Active Developers" },
            { end: 50000, suffix: "+", label: "Battles Completed" },
            { end: 95, suffix: "%", label: "Success Rate" },
          ].map((stat, i) => (
            <div key={i}>
              <Counter
                end={stat.end}
                suffix={stat.suffix}
                startCounting={visible}
              />
              <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;