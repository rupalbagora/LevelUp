import React from "react";
import { motion } from "framer-motion";
import { Terminal, Code2, Cpu, ChevronRight } from "lucide-react";

const CodeSection = () => {
  // Line-by-line code simulation
  const codeLines = [
    { text: "import { Battle } from 'arena-core';", color: "text-purple-400" },
    { text: "const user = await LevelUp.auth();", color: "text-blue-400" },
    { text: "", text: "" },
    { text: "async function startChallenge() {", color: "text-yellow-400" },
    { text: "  const session = new Battle('Hard');", color: "text-blue-300" },
    { text: "  console.log('Initializing Arena...');", color: "text-slate-400" },
    { text: "  await session.launch();", color: "text-green-400" },
    { text: "}", color: "text-yellow-400" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
            <Code2 size={20} />
            <span className="uppercase tracking-widest text-sm">Developer Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Built for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Next Generation.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
            Hamara environment itna smooth hai ki aapko lagta hi nahi ki aap browser mein hain. 
            Real-time feedback aur intelligent suggestions ke sath code karein.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <Terminal size={18} />
              </div>
              <div>
                <h4 className="font-bold dark:text-white">Smart Terminal</h4>
                <p className="text-sm dark:text-slate-400">Integrated output console.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                <Cpu size={18} />
              </div>
              <div>
                <h4 className="font-bold dark:text-white">Fast Execution</h4>
                <p className="text-sm dark:text-slate-400">Sub-millisecond latency.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: The "Fake" Editor (Visual Simulation) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1 }}
          className="relative perspective-1000"
        >
          <div className="w-full bg-[#0D1117] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden">
            
            {/* Toolbar */}
            <div className="bg-[#161B22] px-4 py-3 flex justify-between items-center border-b border-slate-800">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                LevelUp_Arena.js — 124ms
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-6 text-left font-mono text-sm leading-relaxed min-h-[300px]">
              {codeLines.map((line, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex gap-4"
                >
                  <span className="text-slate-700 w-4 text-right select-none">{i+1}</span>
                  <span className={`${line.color} whitespace-pre`}>{line.text}</span>
                </motion.div>
              ))}
              
              {/* Fake Blinking Cursor */}
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-5 bg-blue-500 ml-1 translate-y-1"
              ></motion.div>
            </div>

            {/* Visual Terminal Bottom */}
            <div className="bg-[#010409] border-t border-slate-800 p-4">
              <div className="flex items-center gap-2 text-green-500 text-xs mb-2">
                <ChevronRight size={12} />
                <span className="font-bold">Build Successful</span>
              </div>
              <div className="text-slate-500 text-[10px] font-mono">
                [info] All tests passed (12/12) <br />
                [info] Deployment ready for production...
              </div>
            </div>
          </div>

          {/* Glowing Accents */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default CodeSection;