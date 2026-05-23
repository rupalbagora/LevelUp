import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Zap,
  Copy,
  Share2,
  Swords,
  CheckCircle2,
  Lock,
  Loader2,
  XCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createBattleAPI, joinBattleAPI } from "../../services/battleService";
import { io } from "socket.io-client";

const BattleSetup = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // --- States ---
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ topic: "", difficulty: "" });
  const [battleId, setBattleId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const socketRef = useRef(null);

  // const [showWaitingModal, setShowWaitingModal] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(120); // 2 minutes timer (in seconds)

  // --- Logic functions ---
  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const data = await createBattleAPI(selection.topic, selection.difficulty);
      if (data.battleId) {
        setBattleId(data.battleId);
        setStep(3);
      }
    } catch (err) {
      alert("Link generate nahi ho payi. Please check if you're logged in!");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    // Yahan '/challenge/' use karo taaki opponent pehle Accept/Decline dekhe
    const link = `${window.location.origin}/battle/${battleId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const handleStartBattle = () => {
  //   if (!user) {
  //     navigate("/signin");
  //   } else {
  //     setShowWaitingModal(true);
  //     setBattleStatus("waiting");
  //     setTimeLeft(120); // Reset timer to 2 mins
  //   }
  // };

  // Polling & Timer Logic
  // Polling & Timer Logic
  // useEffect(() => {
  //   let interval;
  //   let timer;

  //   if (showWaitingModal && battleStatus === "waiting") {
  //     // 1. Polling for Status
  //     interval = setInterval(async () => {
  //       try {
  //         // Yahan variable ka naam 'response' rakha hai
  //         const response = await joinBattleAPI(battleId).catch(err => {
  //           return err.response;
  //         });

  //         // Fix: 'data' ki jagah 'response' use kiya hai
  //         if (response && response.status === "ongoing") {
  //         setBattleStatus("ongoing");
  //         clearInterval(interval);
  //         clearInterval(timer);
  //         navigate(`/battle/${battleId}`); // Ye aapko Editor page par le jayega
  //         } else if (response && response.status === "cancelled") {
  //           setBattleStatus("cancelled");
  //           clearInterval(interval);
  //           clearInterval(timer);
  //         }
  //       } catch (err) {
  //         console.log("Waiting for opponent to take action...");
  //       }
  //     }, 3000);

  //     // 2. Countdown Timer
  //     timer = setInterval(() => {
  //       setTimeLeft((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(timer);
  //           clearInterval(interval);
  //           handleExpireBattle();
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   }

  //   return () => {
  //     clearInterval(interval);
  //     clearInterval(timer);
  //   };
  // }, [showWaitingModal, battleId, battleStatus, navigate]);

  // const handleExpireBattle = async () => {
  //   setBattleStatus("expired");
  //   try {
  //     await terminateBattleAPI(battleId); // Backend par link expire kar do
  //   } catch (err) {
  //     console.error("Expiry update failed");
  //   }
  // };

  // Timer format helper (02:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    return () => socketRef.current?.disconnect();
  }, []);

const handleStartBattle = () => {
    

    setIsWaiting(true);
    const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinBattleRoom", battleId);
    });

    socket.on("battleStarted", () => {
      socket.disconnect();
      navigate(`/battle/${battleId}`);
    });
  };

  const topics = [
    { id: "arrays", name: "Arrays", icon: "📊" }, // was "Arrays & Strings"
    { id: "list", name: "Linked Lists", icon: "🔗" },
    { id: "tree", name: "Trees & Graphs", icon: "🌳" },
    { id: "dp", name: "Dynamic Programming", icon: "🧮" },
    { id: "search", name: "Binary Search", icon: "🔍" },
    { id: "sort", name: "Sorting Algorithms", icon: "📈" },
  ];

  const difficulties = [
    {
      id: "easy",
      name: "Easy",
      desc: "Perfect for beginners",
      color: "text-emerald-500",
    },
    {
      id: "medium",
      name: "Medium",
      desc: "Moderate challenge",
      color: "text-blue-500",
    },
    { id: "hard", name: "Hard", desc: "Expert level", color: "text-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050816] py-12 px-6 font-sans">
      {isWaiting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#050816]">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-white font-bold text-xl tracking-widest uppercase">
            Waiting for opponent...
          </p>
          <p className="text-slate-500 text-sm">
            Share the link — battle starts when they join
          </p>
          <button
            onClick={() => {
              socketRef.current?.disconnect();
              setIsWaiting(false);
            }}
            className="mt-2 px-6 py-2 rounded-xl border border-white/10 text-white/30 text-sm hover:text-white/60 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all mb-10"
      >
        <ChevronLeft size={20} /> Back to Dashboard
      </button>

      {/* GAMIFIED MAP STEPS */}
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-4 mb-16 relative">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{
                  backgroundColor: step >= s ? "#2563eb" : "#e2e8f0",
                  scale: step === s ? 1.2 : 1,
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-xl z-10"
              >
                {step > s ? <CheckCircle2 size={24} /> : s}
              </motion.div>
              <span
                className={`absolute -bottom-7 text-[10px] font-black uppercase tracking-tighter ${step === s ? "text-blue-600" : "text-slate-400"}`}
              >
                {s === 1 ? "Topic" : s === 2 ? "Difficulty" : "Launch"}
              </span>
            </div>
            {s < 3 && (
              <div className="w-20 h-1 bg-slate-200 dark:bg-white/5 relative overflow-hidden">
                <motion.div
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
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-[#060910] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5"
            >
              <h2 className="text-2xl font-black mb-2">Choose Your Topic</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setSelection({ ...selection, topic: t.name })
                    }
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${selection.topic === t.name ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10" : "border-slate-100 dark:border-white/5"}`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="font-bold text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!selection.topic}
                onClick={() => setStep(2)}
                className="w-full mt-8 bg-blue-600 disabled:bg-slate-300 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Next Step <Zap size={18} fill="currentColor" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white dark:bg-[#060910] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5"
            >
              <h2 className="text-2xl font-black mb-2">Select Difficulty</h2>
              <div className="space-y-4 mt-6">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    onClick={() =>
                      setSelection({ ...selection, difficulty: d.name })
                    }
                    className={`w-full flex flex-col items-start p-6 rounded-2xl border-2 transition-all ${selection.difficulty === d.name ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10" : "border-slate-100 dark:border-white/5"}`}
                  >
                    <span className={`font-black text-lg ${d.color}`}>
                      {d.name}
                    </span>
                    <span className="text-xs text-slate-500">{d.desc}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-slate-100 dark:border-white/5 rounded-2xl font-bold"
                >
                  Back
                </button>
                <button
                  disabled={!selection.difficulty || isGenerating}
                  onClick={handleGenerateLink}
                  className="flex-[2] bg-blue-600 disabled:bg-slate-300 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg"
                >
                  {isGenerating ? "Generating..." : "Generate Battle Link"}
                </button>
              </div>
            </motion.div>
          )}

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
              <p className="text-slate-500 mb-8">
                Share this link with your opponent
              </p>

              <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between mb-8">
                <span className="text-xs font-mono truncate mr-4 text-blue-600">
                  {window.location.origin}/battle/{battleId}
                </span>
                <button
                  onClick={copyToClipboard}
                  className={`${copied ? "bg-emerald-500" : "bg-blue-600"} p-2 rounded-xl text-white transition-all`}
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase">
                  Topic
                  <br />
                  <span className="text-blue-600">{selection.topic}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase">
                  Diff
                  <br />
                  <span className="text-blue-600">{selection.difficulty}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase">
                  Hints
                  <br />
                  <span className="text-blue-600">3 Available</span>
                </div>
              </div>

              <button
                className="w-full bg-blue-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest mb-4 shadow-xl"
                onClick={handleStartBattle}
              >
                Start Battle Now
              </button>
              <button
                onClick={() => setStep(1)}
                className="text-slate-400 font-bold hover:text-blue-600 transition-colors"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
    </div>
  );
};

export default BattleSetup;
