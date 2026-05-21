import { useEffect, useState } from "react";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Zap, Target, Lightbulb, Clock, PlusCircle,
//   CheckCircle, Trophy, BarChart3, AlertCircle,
//   Sparkles, Code, Brain, Share2, Download
// } from "lucide-react";
// import gsap from "gsap";
// import confetti from "canvas-confetti";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
// } from 'recharts';

// const VictoryResultScreen = ({ result, isDarkMode = false }) => {
//   const [showAnalysis, setShowAnalysis] = useState(false);

//   // --- Sound Logic ---
//   const playVictorySound = () => {
//     const audio = new Audio("/sounds/victory.mp3");
//     audio.volume = 0.4;
//     audio.play().catch(() => console.log("Sound autoplay blocked by browser"));
//   };

//   const data = result || {
//     winnerName: "Neha Prajapati",
//     opponentName: "CodeNinja92",
//     problemTitle: "Rotate Image (48)",
//     difficulty: "Medium",
//     status: "WIN",
//     description: "Rotate an n x n 2D matrix by 90 degrees clockwise in-place efficiently.",
//     tags: ["Array", "Matrix", "Math", "In-Place"],
//     stats: {
//       time: "12 sec",
//       accuracy: "95%",
//       speed: "Fastest 5%",
//       errors: "0 Failed",
//       attempts: 1,
//       memory: "14.2 MB",
//       rank: "#12"
//     },
//     accuracyCompare: [ { name: 'You', val: 95 }, { name: 'Opponent', val: 78 } ],
//     radarData: [
//       { subject: 'Logic', A: 120, fullMark: 150 },
//       { subject: 'Speed', A: 150, fullMark: 150 },
//       { subject: 'Memory', A: 86, fullMark: 150 },
//       { subject: 'Syntax', A: 99, fullMark: 150 },
//       { subject: 'Edge Cases', A: 130, fullMark: 150 },
//     ]
//   };

//   useEffect(() => {
//     // 🎉 Initial Celebration
//     confetti({
//       particleCount: 150,
//       spread: 70,
//       origin: { y: 0.6 },
//       colors: ['#22c55e', '#3b82f6', '#facc15']
//     });
//     playVictorySound();

//     // ⚡ Entrance Animations
//     const tl = gsap.timeline();
//     tl.fromTo(".reveal_up",
//       { opacity: 0, y: 50 },
//       { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power4.out" }
//     );

//     // 🎈 Background Floating Logic
//     gsap.to(".floating_item", {
//       y: -30,
//       x: 10,
//       rotation: 15,
//       duration: 3,
//       repeat: -1,
//       yoyo: true,
//       ease: "sine.inOut",
//       stagger: { each: 0.5, from: "random" }
//     });

//     // 🌊 Subtle Pulse for Banner
//     gsap.to(".banner_glow", {
//       opacity: 0.6,
//       scale: 1.1,
//       duration: 2,
//       repeat: -1,
//       yoyo: true
//     });
//   }, []);

//   // Theme Palette
//   const theme = {
//     bg: isDarkMode ? "bg-[#0a0a0c]" : "bg-slate-50",
//     card: isDarkMode ? "bg-[#111114] border-white/5" : "bg-white border-slate-200 shadow-xl",
//     text: isDarkMode ? "text-slate-200" : "text-slate-900",
//     subText: isDarkMode ? "text-slate-400" : "text-slate-500",
//     banner: isDarkMode ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200",
//     accent: "text-blue-500",
//     success: "text-green-500"
//   };

//   // --- Reusable Animated Progress Component ---
//   const SkillBar = ({ label, percentage, description, color = "bg-blue-500" }) => {
//     const barRef = useRef(null);
//     useEffect(() => {
//       gsap.fromTo(barRef.current,
//         { width: "0%" },
//         { width: `${percentage}%`, duration: 1.8, delay: 1, ease: "expo.out" }
//       );
//     }, [percentage]);

//     return (
//       <div className="mb-8 group">
//         <div className="flex justify-between items-center mb-2">
//           <p className="text-sm font-bold tracking-tight group-hover:text-blue-400 transition-colors">{label}</p>
//           <p className="text-xs font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded">{percentage}%</p>
//         </div>
//         <div className={`w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} h-2.5 rounded-full overflow-hidden shadow-inner`}>
//           <div ref={barRef} className={`h-full ${color} rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)]`} />
//         </div>
//         <p className={`text-[11px] mt-2 font-medium ${theme.subText} leading-relaxed`}>{description}</p>
//       </div>
//     );
//   };

//   return (
//     <div className={`min-h-screen ${theme.bg} ${theme.text} p-6 md:p-12 font-sans overflow-x-hidden relative selection:bg-blue-500/30`}>

//       {/* ✨ ANIMATED BACKGROUND LAYER */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="floating_item absolute top-20 left-[10%] opacity-20 text-blue-500"><Code size={40}/></div>
//         <div className="floating_item absolute bottom-40 right-[15%] opacity-20 text-green-500"><Trophy size={80}/></div>
//         <div className="floating_item absolute top-1/2 left-10 opacity-10 text-purple-500 font-bold text-6xl italic">{"=>"}</div>
//         <div className="floating_item absolute top-[15%] right-[25%] opacity-10 text-yellow-500 font-bold text-5xl italic">{"{ }"}</div>
//         <div className="floating_item absolute bottom-20 left-1/4 opacity-10 text-red-500 font-bold text-4xl">{"[]"}</div>
//         <div className="banner_glow absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/10 blur-[120px] rounded-full" />
//       </div>

//       {/* 🏆 HEADER BANNER */}
//       <div className={`reveal_up ${theme.banner} border rounded-[3.5rem] p-12 mb-12 text-center relative overflow-hidden group shadow-2xl`}>
//         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />

//         <div className="relative z-10">
//           <div className="text-7xl mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">🏆</div>
//           <h1 className={`text-6xl md:text-9xl font-black italic tracking-tighter ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-4 uppercase`}>
//             Victory!
//           </h1>
//           <p className="text-xl opacity-90 mb-8 font-medium">
//             Masterful performance! You dominated <span className="font-bold underline text-blue-500">{data.opponentName}</span>
//           </p>

//           <div className="flex flex-wrap justify-center gap-6">
//             <div className="bg-green-500/20 backdrop-blur-2xl px-8 py-3 rounded-2xl border border-green-500/30 flex items-center gap-3 font-black text-green-400 hover:scale-110 transition-transform">
//               <PlusCircle size={22}/> 250 XP
//             </div>
//             <div className="bg-blue-500/20 backdrop-blur-2xl px-8 py-3 rounded-2xl border border-blue-500/30 flex items-center gap-3 font-black text-blue-400 hover:scale-110 transition-transform">
//               <CheckCircle size={22}/> +15 Rating
//             </div>
//             <div className="bg-yellow-500/20 backdrop-blur-2xl px-8 py-3 rounded-2xl border border-yellow-500/30 flex items-center gap-3 font-black text-yellow-400 hover:scale-110 transition-transform">
//               <Sparkles size={22}/> Win Streak: 5
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ⚡ CORE STATS GRID */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
//         {[
//           { icon: <Clock />, label: "Time Taken", val: data.stats.time, color: "text-blue-400", sub: "↗ 27s Faster" },
//           { icon: <Target />, label: "Accuracy", val: data.stats.accuracy, color: "text-green-400", sub: "Perfect Logic" },
//           { icon: <Brain />, label: "Complexity", val: "O(N²)", color: "text-purple-400", sub: "Optimal Space" },
//           { icon: <BarChart3 />, label: "Global Rank", val: data.stats.rank, color: "text-yellow-400", sub: "Top 2% Today" }
//         ].map((s, i) => (
//           <div key={i} className={`reveal_up ${theme.card} border p-8 rounded-[2.5rem] flex flex-col items-center hover:translate-y-[-10px] transition-all duration-500 group shadow-2xl relative overflow-hidden`}>
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className={`p-4 rounded-3xl bg-slate-500/5 ${s.color} mb-4 group-hover:scale-110 transition-transform`}>{s.icon}</div>
//             <p className="text-[11px] uppercase tracking-[0.2em] font-black opacity-50 mb-1">{s.label}</p>
//             <p className="text-4xl font-black mb-1">{s.val}</p>
//             <p className={`text-xs font-bold ${s.color} opacity-80`}>{s.sub}</p>
//           </div>
//         ))}
//       </div>

//       {/* 🧠 PROBLEM CONTEXT & ATTEMPTS */}
//       <div className="reveal_up grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
//         <div className={`${theme.card} lg:col-span-2 border p-10 rounded-[3rem] shadow-2xl relative`}>
//            <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h2 className="text-3xl font-black italic mb-2 tracking-tight">{data.problemTitle}</h2>
//                 <div className="flex gap-3">
//                    {data.tags.map(t => <span key={t} className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-bold uppercase">{t}</span>)}
//                 </div>
//               </div>
//               <span className="bg-red-500/10 text-red-500 px-6 py-2 rounded-2xl text-xs font-black border border-red-500/20 shadow-lg">DIFFICULTY: {data.difficulty}</span>
//            </div>
//            <p className={`${theme.subText} text-md leading-relaxed mb-0 font-medium italic`}>"{data.description}"</p>
//         </div>

//         <div className={`${theme.card} border p-10 rounded-[3rem] flex flex-col justify-center items-center text-center shadow-2xl group`}>
//            <div className="p-6 bg-red-500/10 rounded-full mb-4 group-hover:rotate-12 transition-transform">
//               <AlertCircle className="text-red-500" size={40} />
//            </div>
//            <p className="text-5xl font-black mb-1">{data.stats.attempts}</p>
//            <p className="text-sm uppercase tracking-widest font-black opacity-60">Total Attempts</p>
//            <div className="mt-4 px-4 py-1 bg-red-500/5 border border-red-500/10 rounded-full">
//               <p className="text-[11px] text-red-400 font-bold">{data.stats.errors} Throughout Battle</p>
//            </div>
//         </div>
//       </div>

//       {/* 📊 DATA VISUALIZATION SECTION */}
//       <div className="reveal_up grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//         {/* Accuracy Comparison */}
//         <div className={`${theme.card} border p-10 rounded-[3rem] h-[450px] shadow-2xl relative`}>
//           <div className="flex justify-between items-center mb-10">
//             <h3 className="text-md font-black uppercase tracking-tighter flex items-center gap-3">
//               <BarChart3 size={20} className="text-green-400"/> Head-to-Head Accuracy
//             </h3>
//             <div className="flex gap-4 text-[10px] font-bold">
//               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> YOU</div>
//               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" /> OPPONENT</div>
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height="75%">
//             <BarChart data={data.accuracyCompare}>
//               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 14, fontWeight: 'bold'}} />
//               <Tooltip
//                 cursor={{fill: 'rgba(255,255,255,0.03)'}}
//                 contentStyle={{borderRadius: '24px', backgroundColor: '#1e293b', border: '2px solid rgba(255,255,255,0.1)', color: '#fff', padding: '15px'}}
//               />
//               <Bar dataKey="val" radius={[20, 20, 20, 20]} barSize={90}>
//                 {data.accuracyCompare.map((e, i) => (
//                   <Cell key={i} fill={i === 0 ? '#22c55e' : '#3b82f6'} fillOpacity={0.9} shadow="0 10px 20px rgba(0,0,0,0.5)" />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Skill Breakdown Radar */}
//         <div className={`${theme.card} border p-10 rounded-[3rem] h-[450px] shadow-2xl`}>
//           <h3 className="text-md font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
//             <Sparkles size={20} className="text-blue-400"/> Technical Proficiency
//           </h3>
//           <ResponsiveContainer width="100%" height="85%">
//             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
//               <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
//               <PolarAngleAxis dataKey="subject" tick={{fill: isDarkMode ? '#94a3b8' : '#475569', fontSize: 12, fontWeight: 'bold'}} />
//               <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
//               <Tooltip contentStyle={{borderRadius: '20px', backgroundColor: '#0f172a', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}} />
//               <Radar
//                 name="Proficiency"
//                 dataKey="A"
//                 stroke="#3b82f6"
//                 fill="#3b82f6"
//                 fillOpacity={0.5}
//                 dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
//                 activeDot={{ r: 8, fill: "#fff" }}
//               />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* 📝 ANALYSIS & COACHING */}
//       <div className="reveal_up grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
//         <div className={`${theme.card} border p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden`}>
//           <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={120}/></div>
//           <h3 className="text-lg font-black uppercase tracking-widest mb-10 flex items-center gap-3 text-green-400">
//             <Zap size={24}/> Peak Performance
//           </h3>
//           <SkillBar label="Algorithmic Logic" percentage={95} description="Your matrix transposition logic was executed with zero logical fallacies." />
//           <SkillBar label="Memory Optimization" percentage={82} description="In-place rotation saved 4.2MB compared to standard methods." color="bg-green-500" />
//           <SkillBar label="Syntax Precision" percentage={99} description="Perfect semicolon and bracket placement throughout the script." color="bg-purple-500" />
//         </div>

//         <div className={`${theme.card} border p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden`}>
//            <div className="absolute top-0 right-0 p-8 opacity-5"><Lightbulb size={120}/></div>
//           <h3 className="text-lg font-black uppercase tracking-widest mb-10 flex items-center gap-3 text-blue-400">
//             <Lightbulb size={24}/> Expert Feedback
//           </h3>
//           <div className="space-y-6">
//             <div className={`p-6 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-colors`}>
//               <p className="text-sm font-black mb-2 flex items-center gap-2"><Code size={16} className="text-blue-400"/> Optimization Hint</p>
//               <p className={`text-xs ${theme.subText} leading-relaxed font-medium`}>Consider using bitwise operators for even faster math operations in large matrices.</p>
//             </div>
//             <div className={`p-6 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} rounded-[2rem] border border-white/5 hover:border-green-500/30 transition-colors`}>
//               <p className="text-sm font-black mb-2 flex items-center gap-2"><Target size={16} className="text-green-400"/> Best Practice</p>
//               <p className={`text-xs ${theme.subText} leading-relaxed font-medium`}>Your use of descriptive variables for 'row' and 'col' improved readability significantly.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🚀 FINAL ACTION HUB */}
//       <div className="reveal_up flex flex-col md:flex-row gap-6 justify-center items-center max-w-2xl mx-auto pb-20">
//         <button className="group relative w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-[2rem] font-black text-white shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-2 active:scale-95 overflow-hidden">
//           <span className="relative z-10 flex items-center justify-center gap-3 text-lg">NEXT CHALLENGE <Zap size={20} fill="white"/></span>
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-700 transition-transform" />
//         </button>

//         <div className="flex w-full gap-4">
//           <button className={`${theme.card} border flex-1 py-6 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-white/5 transition-all shadow-xl`}>
//             <Share2 size={20}/> SHARE
//           </button>
//           <button className={`${theme.card} border flex-1 py-6 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-white/5 transition-all shadow-xl`}>
//             <Download size={20}/> STATS
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default VictoryResultScreen;

export default function VictoryResultScreen({ result, players }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!result) return;

    setCountdown(10);

    const countdownTimer = setInterval(() => {
      setCountdown((seconds) => {
        if (seconds <= 1) {
          clearInterval(countdownTimer);
          window.location.href = "/";
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [result]);

  if (!result) return null;

  let message;
  let color;

  if (result.status === "winner") {
    message = "🏆 You Won!";
    color = "text-green-600";
  } else if (result.status === "defeated") {
    message = "💀 You Lost";
    color = "text-red-600";
  } else {
    message = "🤝 Draw";
    color = "text-yellow-600";
  }

  message =
    result.status === "winner"
      ? "You Won!"
      : result.status === "defeated"
        ? "You Lost"
        : "Draw";
  color =
    result.status === "winner"
      ? "text-emerald-400"
      : result.status === "defeated"
        ? "text-red-400"
        : "text-yellow-300";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
        <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-black tracking-[0.25em] text-white/70">
          {result.status === "winner"
            ? "WIN"
            : result.status === "defeated"
              ? "LOSS"
              : "DRAW"}
        </span>
        <h1 className={`mt-5 text-4xl font-black ${color}`}>{message}</h1>
        <p className="mt-3 text-sm text-slate-300">
          The match is complete. You will be returned home shortly.
        </p>

        <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10 bg-[#050816] shadow-inner">
          <span className="text-4xl font-black tabular-nums">{countdown}</span>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Redirecting to home
        </p>
      </div>
    </div>
  );
}
