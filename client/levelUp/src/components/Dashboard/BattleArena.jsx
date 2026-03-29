import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Clock,
  Zap,
  Shield,
  Trophy,
  ChevronRight,
  Send,
  RotateCcw,
  Maximize2,
  Wifi,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";

// ─── FAKE OPPONENT TYPING SIMULATION ───────────────────────────────────────
const opponentSnippets = [
  "function binarySearch(arr, target) {\n",
  "  let left = 0;\n",
  "  let right = arr.length - 1;\n",
  "  while (left <= right) {\n",
  "    const mid = Math.floor((left + right) / 2);\n",
  "    if (arr[mid] === target) return mid;\n",
  "  }\n",
  "  return -1;\n",
  "}\n",
];

// ─── PROBLEM DATA ────────────────────────────────────────────────────────────
const PROBLEM = {
  title: "Binary Search",
  difficulty: "Medium",
  topic: "Binary Search",
  complexity: "O(log n) expected",
  description:
    "Implement binary search to find a target element in a sorted array. Return the index if found, or -1 if not.",
  examples: [
    { input: "arr = [1,3,5,7,9], target = 5", output: "2" },
    { input: "arr = [2,4,6,8], target = 3", output: "-1" },
  ],
  constraints: [
    "1 ≤ arr.length ≤ 10⁴",
    "Array is sorted in ascending order",
    "All elements are unique",
  ],
};

// ─── COUNTDOWN SCREEN ────────────────────────────────────────────────────────
const CountdownScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState("waiting"); // waiting | countdown | go
  const [count, setCount] = useState(3);
  const [opponentJoined, setOpponentJoined] = useState(false);

  useEffect(() => {
    // Simulate opponent joining after 1.5s
    const joinTimer = setTimeout(() => {
      setOpponentJoined(true);
      setTimeout(() => setPhase("countdown"), 800);
    }, 1500);
    return () => clearTimeout(joinTimer);
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count === 0) {
      setPhase("go");
      setTimeout(onComplete, 900);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050816] flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(112,0,255,0.07) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(112,0,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(112,0,255,0.18)_0%,transparent_70%)]" />

      <AnimatePresence mode="wait">
        {/* WAITING FOR OPPONENT */}
        {phase === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-6 mb-10">
              {/* Player card */}
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7000ff] to-[#00d4ff] flex items-center justify-center text-3xl font-black text-white shadow-[0_0_30px_rgba(112,0,255,0.5)]">
                  R
                </div>
                <span className="text-white font-bold text-sm">
                  rupal.bagora
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  READY
                </span>
              </motion.div>

              {/* VS */}
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Swords className="w-10 h-10 text-[#7000ff]" />
                <span className="text-[#7000ff] font-black text-xl tracking-widest">
                  VS
                </span>
              </motion.div>

              {/* Opponent card */}
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black transition-all duration-500 ${
                    opponentJoined
                      ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                      : "bg-white/5 border-2 border-dashed border-white/20"
                  }`}
                >
                  {opponentJoined ? (
                    "C"
                  ) : (
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
                <span
                  className={`font-bold text-sm transition-colors ${opponentJoined ? "text-white" : "text-white/30"}`}
                >
                  {opponentJoined ? "CodeNinja92" : "Waiting..."}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                    opponentJoined
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-white/5 text-white/20 border-white/10"
                  }`}
                >
                  {opponentJoined ? "READY" : "JOINING"}
                </span>
              </motion.div>
            </div>

            <motion.div
              className="flex items-center gap-2 text-white/40 text-sm justify-center"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Wifi size={14} />
              {opponentJoined
                ? "Both players connected! Starting..."
                : "Waiting for opponent to join..."}
            </motion.div>
          </motion.div>
        )}

        {/* COUNTDOWN */}
        {phase === "countdown" && count > 0 && (
          <motion.div
            key={`count-${count}`}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <div className="relative">
              <div
                className="text-[200px] font-black leading-none"
                style={{
                  background:
                    count === 3
                      ? "linear-gradient(135deg, #7000ff, #00d4ff)"
                      : count === 2
                        ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                        : "linear-gradient(135deg, #10b981, #00d4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 60px rgba(112,0,255,0.6))",
                }}
              >
                {count}
              </div>
              {/* Ring pulse */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-[#7000ff]/50"
                animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
            <p className="text-white/50 text-lg font-bold tracking-[0.3em] uppercase mt-4">
              {count === 3
                ? "Get Ready"
                : count === 2
                  ? "Focus Up"
                  : "Almost..."}
            </p>
          </motion.div>
        )}

        {/* GO! */}
        {phase === "go" && (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.3, 1], opacity: 1 }}
            transition={{ duration: 0.5, times: [0, 0.6, 1] }}
            className="text-center"
          >
            <div
              className="text-[120px] font-black tracking-tighter"
              style={{
                background: "linear-gradient(135deg, #10b981, #00d4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 80px rgba(16,185,129,0.8))",
              }}
            >
              FIGHT!
            </div>
            <motion.div
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 0.4 }}
              className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full mt-4"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN BATTLE ARENA ───────────────────────────────────────────────────────
const BattleArena = () => {
  const [showCountdown, setShowCountdown] = useState(true);
  const [arenaVisible, setArenaVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [myCode, setMyCode] = useState("// Write your solution here\n\n");
  const [opponentCode, setOpponentCode] = useState("");
  const [opponentProgress, setOpponentProgress] = useState(2);
  const [myStatus, setMyStatus] = useState("typing"); // typing | submitted | passed | failed
  const [opponentStatus, setOpponentStatus] = useState("coding");
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [activeHint, setActiveHint] = useState("");
  const [showProblem, setShowProblem] = useState(true);
  const [xp, setXp] = useState(0);
  const opponentIdx = useRef(0);
  const timerRef = useRef(null);

  const hints = [
    "💡 Think about dividing the search space in half each time.",
    "💡 Use two pointers: left = 0, right = arr.length - 1.",
    "💡 The mid index is Math.floor((left + right) / 2).",
  ];

  // Start arena after countdown
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setTimeout(() => setArenaVisible(true), 100);
  };

  // Timer countdown
  useEffect(() => {
    if (!arenaVisible || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [arenaVisible, submitted]);

  // Opponent typing simulation
  useEffect(() => {
    if (!arenaVisible) return;
    const type = () => {
      if (opponentIdx.current >= opponentSnippets.length) return;
      const next = opponentSnippets[opponentIdx.current];
      setOpponentCode((prev) => prev + next);
      opponentIdx.current++;
      setOpponentProgress((p) => Math.min(p + 11, 88));
      if (opponentIdx.current < opponentSnippets.length) {
        setTimeout(type, 1200 + Math.random() * 1000);
      } else {
        setOpponentStatus("submitted");
      }
    };
    const initial = setTimeout(type, 2000);
    return () => clearTimeout(initial);
  }, [arenaVisible]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const timeColor =
    timeLeft > 120
      ? "text-emerald-400"
      : timeLeft > 30
        ? "text-amber-400"
        : "text-rose-400";
  const timePulse = timeLeft <= 30;

  const handleSubmit = () => {
    setSubmitted(true);
    setMyStatus("submitted");
    clearInterval(timerRef.current);
    setTimeout(() => {
      setMyStatus("passed");
      setShowSuccess(true);
      setXp(420);
    }, 1500);
  };

  const handleHint = () => {
    if (hintsLeft === 0) return;
    setActiveHint(hints[3 - hintsLeft]);
    setHintsLeft((h) => h - 1);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 5000);
  };

  return (
    <>
      <AnimatePresence>
        {showCountdown && (
          <CountdownScreen onComplete={handleCountdownComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {arenaVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#050816] font-mono flex flex-col overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(112,0,255,0.04) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(112,0,255,0.04) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          >
            {/* ── TOP NAVBAR ───────────────────────────────────────────────── */}
            <motion.header
              initial={{ y: -60 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#050816]/90 backdrop-blur-md sticky top-0 z-40"
            >
              {/* Left: Battle info */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#7000ff] to-[#00d4ff] rounded-xl">
                  <Swords className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">
                      Battle Arena
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                      LIVE
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-white/40">
                    <span className="text-[#00d4ff]">{PROBLEM.topic}</span>
                    <span>•</span>
                    <span className="text-amber-400">{PROBLEM.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Center: Timer */}
              <motion.div
                animate={timePulse ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl border font-mono font-black text-2xl tracking-widest ${
                  timeLeft > 120
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                    : timeLeft > 30
                      ? "border-amber-500/30 bg-amber-500/5 text-amber-400"
                      : "border-rose-500/30 bg-rose-500/5 text-rose-400"
                }`}
              >
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </motion.div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* XP badge */}
                {xp > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold"
                  >
                    <Trophy size={12} /> +{xp} XP
                  </motion.div>
                )}

                {/* Hint button */}
                <button
                  onClick={handleHint}
                  disabled={hintsLeft === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    hintsLeft > 0
                      ? "border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10"
                      : "border-white/5 bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
                >
                  <Zap size={14} />
                  AI Hint ({hintsLeft} left)
                </button>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSubmit}
                  disabled={submitted}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    submitted
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                      : "bg-gradient-to-r from-[#7000ff] to-[#00d4ff] text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                  }`}
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 size={14} /> Submitted
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Submit Solution
                    </>
                  )}
                </motion.button>
              </div>
            </motion.header>

            {/* ── HINT TOAST ────────────────────────────────────────────────── */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: -20, x: "-50%" }}
                  className="fixed top-20 left-1/2 z-50 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium backdrop-blur-xl shadow-xl"
                >
                  {activeHint}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SUCCESS OVERLAY ───────────────────────────────────────────── */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 60 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="text-center p-12 rounded-3xl bg-[#060910] border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.2)]"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, -10, 10, -5, 5, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 0.8 }}
                      className="text-7xl mb-6"
                    >
                      🏆
                    </motion.div>
                    <h2 className="text-4xl font-black text-white mb-2">
                      VICTORY!
                    </h2>
                    <p className="text-emerald-400 font-bold mb-6">
                      All test cases passed
                    </p>
                    <div className="flex gap-4 justify-center mb-8">
                      {[
                        { label: "Time", value: formatTime(600 - timeLeft) },
                        { label: "XP Earned", value: `+${xp}` },
                        { label: "Rank", value: "+12 ↑" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center min-w-[80px]"
                        >
                          <div className="text-white font-black text-lg">
                            {s.value}
                          </div>
                          <div className="text-white/40 text-[10px] uppercase tracking-widest">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowSuccess(false)}
                        className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-bold hover:bg-white/10 transition-all"
                      >
                        View Arena
                      </button>
                      <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7000ff] to-[#00d4ff] text-white text-sm font-bold">
                        Next Battle
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── PLAYERS BAR ───────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between px-6 py-2 bg-white/[0.02] border-b border-white/5"
            >
              {/* Me */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7000ff] to-[#00d4ff] flex items-center justify-center text-white text-xs font-black">
                  R
                </div>
                <span className="text-white font-bold text-sm">
                  rupal.bagora
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {myStatus === "passed"
                    ? "✓ PASSED"
                    : myStatus === "submitted"
                      ? "CHECKING..."
                      : "● ACTIVE"}
                </span>
              </div>

              {/* VS center */}
              <div className="flex items-center gap-2 text-white/20 text-xs font-black tracking-widest">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/10" />
                <Swords size={14} className="text-[#7000ff]" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/10" />
              </div>

              {/* Opponent */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    opponentStatus === "submitted"
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}
                >
                  {opponentStatus === "submitted" ? "✓ SUBMITTED" : "● CODING"}
                </span>
                <span className="text-white font-bold text-sm">
                  CodeNinja92
                </span>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xs font-black">
                  C
                </div>
              </div>
            </motion.div>

            {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
            <div
              className="flex flex-1 overflow-hidden"
              style={{ height: "calc(100vh - 116px)" }}
            >
              {/* Problem Panel (collapsible) */}
              <AnimatePresence>
                {showProblem && (
                  <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-r border-white/5 overflow-y-auto bg-[#060910] flex-shrink-0"
                    style={{ width: 320 }}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">
                          Problem
                        </h3>
                        <button
                          onClick={() => setShowProblem(false)}
                          className="text-white/30 hover:text-white/60 transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>

                      {/* Difficulty badge */}
                      <div className="flex gap-2 mb-4">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-widest">
                          {PROBLEM.difficulty}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#7000ff]/10 border border-[#7000ff]/20 text-[#a855f7] uppercase tracking-widest">
                          {PROBLEM.complexity}
                        </span>
                      </div>

                      <p className="text-white/70 text-sm leading-relaxed mb-5">
                        {PROBLEM.description}
                      </p>

                      <div className="space-y-3 mb-5">
                        {PROBLEM.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-white/[0.03] border border-white/5"
                          >
                            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
                              Example {i + 1}
                            </div>
                            <div className="text-xs text-[#00d4ff] mb-1">
                              Input:{" "}
                              <span className="text-white/70">{ex.input}</span>
                            </div>
                            <div className="text-xs text-emerald-400">
                              Output:{" "}
                              <span className="text-white/70">{ex.output}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">
                          Constraints
                        </div>
                        <ul className="space-y-1.5">
                          {PROBLEM.constraints.map((c, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-white/50"
                            >
                              <ChevronRight
                                size={12}
                                className="text-[#7000ff] mt-0.5 flex-shrink-0"
                              />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>

              {/* Show problem toggle */}
              {!showProblem && (
                <button
                  onClick={() => setShowProblem(true)}
                  className="self-start m-2 p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 transition-all flex-shrink-0"
                >
                  <Eye size={14} />
                </button>
              )}

              {/* ── EDITORS ──────────────────────────────────────────────── */}
              <div className="flex flex-1 gap-0 overflow-hidden">
                {/* MY EDITOR */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 flex flex-col border-r border-white/5"
                >
                  {/* Editor header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b0f1f] border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                      </div>
                      <span className="text-white/40 text-xs font-bold">
                        solution.js
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7000ff]/10 border border-[#7000ff]/20 text-[#a855f7]">
                        JavaScript
                      </span>
                      <span className="text-[10px] text-emerald-400 animate-pulse">
                        ● Typing...
                      </span>
                    </div>
                  </div>

                  {/* Line numbers + textarea */}
                  <div className="flex-1 flex overflow-hidden bg-[#0d1117]">
                    {/* Line numbers */}
                    <div className="py-4 px-3 text-right select-none bg-[#0b0f1f] border-r border-white/5 min-w-[48px]">
                      {myCode.split("\n").map((_, i) => (
                        <div
                          key={i}
                          className="text-white/20 text-xs leading-6 font-mono"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    {/* Code area */}
                    <textarea
                      value={myCode}
                      onChange={(e) => setMyCode(e.target.value)}
                      spellCheck={false}
                      className="flex-1 bg-transparent text-[#e2e8f0] text-sm leading-6 py-4 px-4 resize-none outline-none font-mono caret-[#7000ff]"
                      style={{ tabSize: 2 }}
                      placeholder="// Write your solution here"
                    />
                  </div>

                  {/* My progress bar */}
                  <div className="px-4 py-2 bg-[#0b0f1f] border-t border-white/5 flex items-center gap-3">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                      Progress
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#7000ff] to-[#00d4ff]"
                        animate={{
                          width: submitted
                            ? "100%"
                            : `${Math.min(myCode.length / 2, 95)}%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[10px] text-[#00d4ff] font-bold">
                      {submitted
                        ? "100%"
                        : `${Math.min(Math.floor(myCode.length / 2), 95)}%`}
                    </span>
                  </div>
                </motion.div>

                {/* OPPONENT EDITOR */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 flex flex-col relative"
                >
                  {/* Blur overlay */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(5,8,22,0.1) 0%, rgba(5,8,22,0.05) 100%)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  />

                  {/* Blur label */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-2 opacity-60">
                      <Shield className="w-8 h-8 text-white/20" />
                      <span className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Opponent's Screen
                      </span>
                    </div>
                  </div>

                  {/* Editor header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b0f1f] border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                      </div>
                      <span className="text-white/20 text-xs font-bold">
                        solution.js
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30">
                        JavaScript
                      </span>
                      <span
                        className={`text-[10px] font-bold ${opponentStatus === "submitted" ? "text-orange-400" : "text-amber-400 animate-pulse"}`}
                      >
                        ●{" "}
                        {opponentStatus === "submitted"
                          ? "Submitted"
                          : "Coding..."}
                      </span>
                    </div>
                  </div>

                  {/* Blurred code display */}
                  <div className="flex-1 flex overflow-hidden bg-[#0d1117]">
                    <div className="py-4 px-3 text-right select-none bg-[#0b0f1f] border-r border-white/5 min-w-[48px]">
                      {(opponentCode || "").split("\n").map((_, i) => (
                        <div
                          key={i}
                          className="text-white/10 text-xs leading-6 font-mono"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 py-4 px-4 text-sm leading-6 font-mono text-white/60 whitespace-pre overflow-auto">
                      {opponentCode}
                    </div>
                  </div>

                  {/* Opponent progress bar */}
                  <div className="px-4 py-2 bg-[#0b0f1f] border-t border-white/5 flex items-center gap-3">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                      Progress
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
                        animate={{ width: `${opponentProgress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className="text-[10px] text-orange-400 font-bold">
                      {opponentProgress}%
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ── BOTTOM PROBLEM BAR ────────────────────────────────────────── */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between px-6 py-2.5 bg-[#060910] border-t border-white/5"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/30 font-bold uppercase tracking-widest">
                  Problem:
                </span>
                <span className="text-white/70">{PROBLEM.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#7000ff]/10 border border-[#7000ff]/20 text-[#a855f7] font-bold uppercase tracking-widest">
                  {PROBLEM.complexity}
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase tracking-widest">
                  {PROBLEM.difficulty}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BattleArena;
