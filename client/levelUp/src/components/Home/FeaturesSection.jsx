import React from "react";
import { motion } from "framer-motion";
import { Swords, Users, Code2, ShieldCheck, Zap, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    { title: "Competitive Battles", desc: "Real-time coding competitions worldwide. Face off against top talent in intense 1v1 or group challenges.", icon: <Swords />, lightColor: "hover:shadow-[0_20px_40px_-15px_rgba(112,0,255,0.2)] hover:border-[#7000ff]/40", darkColor: "dark:hover:shadow-[0_0_30px_rgba(112,0,255,0.2)] dark:hover:border-[#7000ff]/50" },
    { title: "Global Community", desc: "Connect and grow with fellow coders. Share solutions, debate logic, and build your professional network.", icon: <Users />, lightColor: "hover:shadow-[0_20px_40px_-15px_rgba(0,212,255,0.2)] hover:border-[#00d4ff]/40", darkColor: "dark:hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] dark:hover:border-[#00d4ff]/50" },
    { title: "Smart Code Editor", desc: "Powerful editor with syntax highlighting and multi-language support. Code directly in your browser without lag.", icon: <Code2 />, lightColor: "hover:shadow-[0_20px_40px_-15px_rgba(112,0,255,0.2)] hover:border-[#7000ff]/40", darkColor: "dark:hover:shadow-[0_0_30px_rgba(112,0,255,0.2)] dark:hover:border-[#7000ff]/50" },
    { title: "Secure Platform", desc: "Advanced anti-cheat system ensures fair play for everyone. Secure sandboxed environment for your code.", icon: <ShieldCheck />, lightColor: "hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:border-emerald-400/40", darkColor: "dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] dark:hover:border-emerald-500/50" },
    { title: "Fast Execution", desc: "Sub-millisecond latency for your code. Get instant feedback and benchmark your performance in real-time.", icon: <Zap />, lightColor: "hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] hover:border-amber-400/40", darkColor: "dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] dark:hover:border-amber-500/50" },
    { title: "Leaderboards", desc: "Track progress and climb the ranks. Earn badges and prestige as you solve harder problems and win battles.", icon: <BarChart3 />, lightColor: "hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.2)] hover:border-pink-400/40", darkColor: "dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] dark:hover:border-pink-500/50" }
  ];

  return (
    <section className="section-base overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <div className="mb-20">
          <h2 className="section-heading">
            Built for the <span className="gradient-text">Pro Coder</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Experience the most advanced competitive programming environment
            ever built.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative 
        p-6 sm:p-8 md:p-10
        rounded-3xl md:rounded-[40px]
         card-base
        hover:-translate-y-2 md:hover:-translate-y-4
        flex flex-col justify-between 
        text-left overflow-hidden
        ${f.lightColor} ${f.darkColor}`}
            >
              {/* Light Mode Inner BG */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-transparent dark:to-transparent -z-10"></div>

              <div>
                {/* Icon */}
                <div
                  className="
          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
          rounded-xl md:rounded-2xl
          bg-slate-100 dark:bg-white/5
          flex items-center justify-center
          text-slate-600 dark:text-[#7000ff]
          mb-5 sm:mb-6 md:mb-8
          group-hover:bg-[#7000ff] 
          group-hover:text-white 
          dark:group-hover:text-[#00d4ff]
          transition-all duration-500
        "
                >
                  {React.cloneElement(f.icon, {
                    size: window.innerWidth < 640 ? 22 : 28,
                  })}
                </div>

                <h3 className="text-xl sm:text-2xl font-black mb-3 md:mb-4 text-slate-900 dark:text-white tracking-tight">
                  {f.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 sm:mt-8 flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7000ff] dark:text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 uppercase tracking-widest">
                Explore <span className="text-lg">→</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;