import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Zap, Copy, Share2, Swords, CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const BattleSetup = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleStartBattle = () => {
    if (!user) {
      navigate("/signin"); // not logged in → send to signin
    } else {
      console.log("kjhgf")
      navigate("/start-battle"); // logged in → go straight to setup
    }
  };
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ topic: "", difficulty: "" });

  const topics = [
    { id: "arrays", name: "Arrays & Strings", icon: "📊" },
    { id: "list", name: "Linked Lists", icon: "🔗" },
    { id: "tree", name: "Trees & Graphs", icon: "🌳" },
    { id: "dp", name: "Dynamic Programming", icon: "🧮" },
    { id: "search", name: "Binary Search", icon: "🔍" },
    { id: "sort", name: "Sorting Algorithms", icon: "📈" },
  ];

  const difficulties = [
    { id: "easy", name: "Easy", desc: "Perfect for beginners", color: "text-emerald-500" },
    { id: "medium", name: "Medium", desc: "Moderate challenge", color: "text-blue-500" },
    { id: "hard", name: "Hard", desc: "Expert level", color: "text-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050816] py-12 px-6 font-sans">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all mb-10">
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      {/* --- GAMIFIED MAP STEPS --- */}
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-4 mb-16 relative">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: step >= s ? "#2563eb" : "#e2e8f0",
                  scale: step === s ? 1.2 : 1,
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-xl z-10`}
              >
                {step > s ? <CheckCircle2 size={24} /> : s}
              </motion.div>
              <span className={`absolute -bottom-7 text-[10px] font-black uppercase tracking-tighter ${step === s ? 'text-blue-600' : 'text-slate-400'}`}>
                {s === 1 ? "Topic" : s === 2 ? "Difficulty" : "Launch"}
              </span>
            </div>
            {s < 3 && (
              <div className="w-20 h-1 bg-slate-200 dark:bg-white/5 relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: step > s ? "100%" : "0%" }}
                  className="absolute h-full bg-blue-500"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: TOPIC SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-[#060910] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5"
            >
              <h2 className="text-2xl font-black mb-2">Choose Your Topic</h2>
              <p className="text-slate-500 text-sm mb-8">Select a DSA topic for this battle</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelection({ ...selection, topic: t.name })}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                      selection.topic === t.name 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10" 
                      : "border-slate-100 dark:border-white/5 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="font-bold text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
              
              <button
                disabled={!selection.topic}
                onClick={() => setStep(2)}
                className="w-full mt-8 bg-blue-600 disabled:bg-slate-300 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Next Step <Zap size={18} fill="currentColor" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: DIFFICULTY */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white dark:bg-[#060910] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5"
            >
              <h2 className="text-2xl font-black mb-2">Select Difficulty</h2>
              <p className="text-slate-500 text-sm mb-8">Topic: <span className="text-blue-600 font-bold">{selection.topic}</span></p>

              <div className="space-y-4">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelection({ ...selection, difficulty: d.name })}
                    className={`w-full flex flex-col items-start p-6 rounded-2xl border-2 transition-all ${
                      selection.difficulty === d.name 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10" 
                      : "border-slate-100 dark:border-white/5"
                    }`}
                  >
                    <span className={`font-black text-lg ${d.color}`}>{d.name}</span>
                    <span className="text-xs text-slate-500">{d.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-slate-100 dark:border-white/5 rounded-2xl font-bold">Back</button>
                <button 
                  disabled={!selection.difficulty}
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-blue-600 disabled:bg-slate-300 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/30"
                >
                  Generate Battle Link
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FINAL LAUNCH */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-[#060910] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <Swords size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2">Battle Created! 🎉</h2>
              <p className="text-slate-500 mb-8">Share this link with your opponent</p>

              <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between mb-8">
                <span className="text-sm font-mono truncate mr-4">levelup.dev/battle/tgza...</span>
                <button className="bg-blue-600 p-2 rounded-xl text-white"><Copy size={18} /></button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase">Topic<br/><span className="text-blue-600">{selection.topic}</span></div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase">Diff<br/><span className="text-blue-600">{selection.difficulty}</span></div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase">Hints<br/><span className="text-blue-600">3 Available</span></div>
              </div>

              <button className="w-full bg-blue-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest mb-4 shadow-xl cursor-pointer" onClick={()=>{handleStartBattle()}}>Start Battle Now</button>
              <button onClick={() => setStep(1)} className="text-slate-400 font-bold hover:text-blue-600 transition-colors">Back to Dashboard</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BattleSetup;