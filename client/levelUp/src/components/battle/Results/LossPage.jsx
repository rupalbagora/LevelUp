import React, { useEffect, useRef } from "react";
import {
  Clock, Target, Brain, BarChart3, AlertTriangle,
  XCircle, Share2, RotateCcw, Lightbulb, Code
} from "lucide-react";
import gsap from "gsap";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarArea
} from 'recharts';

const LossResultScreen = ({ result, isDarkMode = true }) => {
  // const data = result || {
  //   winnerName: "CodeNinja92",
  //   problemTitle: "Rotate Image (48)",
  //   description: "Rotate an n x n 2D matrix by 90 degrees clockwise in-place efficiently.",
  //   tags: ["Array", "Matrix", "Math"],
  //   stats: { time: "45 sec", accuracy: "42%", errors: "3 Failed", attempts: 4, rank: "#452" },
  //   accuracyCompare: [ { name: 'You', val: 42 }, { name: 'Opponent', val: 98 } ],
  //   radarData: [
  //     { subject: 'Logic', A: 40 }, { subject: 'Speed', A: 30 },
  //     { subject: 'Memory', A: 50 }, { subject: 'Syntax', A: 110 }, { subject: 'Edge Cases', A: 20 },
  //   ]
  // };
const data = {
  winnerName: result?.winnerName || "Opponent",
  problemTitle: result?.problemTitle || "Problem",
  stats: {
    time: result?.stats?.time || "0 sec",
    accuracy: result?.stats?.accuracy || "0%",
    errors: result?.stats?.errors || "0",
    attempts: result?.stats?.attempts || 0,
    rank: result?.stats?.rank || "#0",
  },
  accuracyCompare: result?.accuracyCompare || [],
  radarData: result?.radarData || [],
};
  useEffect(() => {
    gsap.fromTo(".reveal_up", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" });
    gsap.fromTo(".loss_title", { x: -8 }, { x: 8, duration: 0.12, repeat: 5, yoyo: true });
  }, []);

  const theme = {
    bg: isDarkMode ? "bg-[#0a0a0c]" : "bg-[#fcfcfd]",
    card: isDarkMode ? "bg-[#111114] border-white/5" : "bg-white border-slate-200 shadow-xl",
    text: isDarkMode ? "text-slate-100" : "text-slate-900",
    subText: isDarkMode ? "text-slate-400" : "text-slate-500",
    banner: isDarkMode ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200",
  };

  const SkillBar = ({ label, percentage, color = "bg-red-500" }) => (
    <div className="mb-6">
      <div className="flex justify-between text-xs font-black mb-2 uppercase tracking-tight">
        <span>{label}</span><span className="text-red-500">{percentage}%</span>
      </div>
      <div className={`w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} h-2 rounded-full overflow-hidden`}>
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(239,68,68,0.3)]`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-6 md:p-10 font-sans transition-colors duration-500 relative`}>

      {/* 🚩 DEFEAT BANNER */}
      <div className={`reveal_up ${theme.banner} border rounded-[2.5rem] p-10 mb-10 text-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 italic font-black text-6xl">DEFEAT</div>
        {/* Rose removed from here */}
        <h1 className="loss_title text-5xl md:text-7xl font-black italic text-red-600 mb-2 uppercase tracking-tighter leading-none">
          Hard Luck!
        </h1>
        <p className="text-lg opacity-80 mb-6 font-semibold max-w-lg mx-auto">
          Tough battle! <span className="font-extrabold underline decoration-red-500/50">{data.winnerName}</span> secured the win this time.
        </p>
        <div className="flex justify-center gap-4">
          <div className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-red-500/20">-12 Rating</div>
          <div className={`${isDarkMode ? 'bg-white/10' : 'bg-slate-200'} px-6 py-2 rounded-xl font-bold text-sm`}>0 XP</div>
        </div>
      </div>

      {/* ⚡ STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto">
        {[
          { icon: <Clock size={22}/>, label: "Total Time", val: data.stats.time, color: "text-slate-400" },
          { icon: <Target size={22}/>, label: "Accuracy", val: data.stats.accuracy, color: "text-red-500" },
          { icon: <Brain size={22}/>, label: "Attempts", val: data.stats.attempts, color: "text-orange-500" },
          { icon: <BarChart3 size={22}/>, label: "Global Rank", val: data.stats.rank, color: "text-slate-400" }
        ].map((s, i) => (
          <div key={i} className={`reveal_up ${theme.card} p-7 rounded-[2rem] border flex flex-col items-center hover:scale-[1.05] transition-all cursor-default`}>
            <div className={`${s.color} mb-3 p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>{s.icon}</div>
            <p className="text-[10px] uppercase font-black opacity-50 tracking-[0.15em] mb-1">{s.label}</p>
            <p className="text-3xl font-black tracking-tighter">{s.val}</p>
          </div>
        ))}
      </div>

      {/* 📊 CHART CARDS */}
      <div className="reveal_up grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 max-w-6xl mx-auto">
        <div className={`${theme.card} border p-8 rounded-[2.5rem] h-[380px]`}>
          <h3 className="text-xs font-black uppercase mb-8 tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Accuracy Comparison
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={data.accuracyCompare}>
              <XAxis dataKey="name" tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', fontWeight: 'bold'}} />
              <Bar dataKey="val" radius={[10, 10, 10, 10]} barSize={55}>
                {data.accuracyCompare.map((e, i) => <Cell key={i} fill={i === 0 ? '#ef4444' : '#64748b'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${theme.card} border p-8 rounded-[2.5rem] h-[380px]`}>
          <h3 className="text-xs font-black uppercase mb-8 tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
              <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              <PolarAngleAxis dataKey="subject" tick={{fill: isDarkMode ? '#94a3b8' : '#475569', fontSize: 10, fontWeight: 'bold'}} />
              <RadarArea name="You" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📝 FEEDBACK & TIPS */}
      <div className="reveal_up grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
        <div className={`${theme.card} border p-8 rounded-[2.5rem]`}>
          <h3 className="text-xs font-black uppercase mb-8 text-red-500 tracking-[0.2em] flex items-center gap-2">
            <AlertTriangle size={16}/> Critical Gaps
          </h3>
          <SkillBar label="Edge Case Handling" percentage={20} />
          <SkillBar label="Memory Management" percentage={35} color="bg-orange-500" />
          <SkillBar label="Execution Speed" percentage={45} color="bg-slate-400" />
        </div>

        <div className={`${theme.card} border p-8 rounded-[2.5rem]`}>
          <h3 className="text-xs font-black uppercase mb-8 text-blue-500 tracking-[0.2em] flex items-center gap-2">
            <Lightbulb size={16}/> Recovery Roadmap
          </h3>
          <div className="space-y-4">
             <div className={`p-5 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} rounded-2xl border border-white/5 flex gap-4 items-start`}>
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 font-bold italic text-sm">TIP</div>
                <p className="text-xs leading-relaxed italic opacity-80 font-semibold">Your matrix logic failed on 1x1 rotations. Re-verify the in-place swap conditions.</p>
             </div>
             <div className={`p-5 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} rounded-2xl border border-white/5 flex gap-4 items-start`}>
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500 font-bold italic text-sm">FIX</div>
                <p className="text-xs leading-relaxed italic opacity-80 font-semibold">Solve "Transpose Matrix" first to clear your basics on 2D arrays.</p>
             </div>
          </div>
        </div>
      </div>

      {/* 🚀 ACTION CENTER (Buttons Size Reduced) */}
      <div className="reveal_up flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto pb-16">
        <button className="flex-grow bg-red-600 hover:bg-red-500 py-3 px-8 rounded-xl font-black text-white shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm uppercase tracking-tighter">
          <RotateCcw size={18}/> RETRY BATTLE
        </button>
        <button className={`${theme.card} px-8 py-3 rounded-xl font-black flex items-center justify-center gap-2 border text-sm uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all`}>
          <Share2 size={18}/> SHARE STATS
        </button>
      </div>

    </div>
  );
};

export default LossResultScreen;

// export default function VictoryResultScreen({ result, players }) {
//   if (!result) return null;

//   let message;
//   let color;

//   if (result.status === "winner") {
//     message = "🏆 You Won!";
//     color = "text-green-600";
//   } else if (result.status === "defeated") {
//     message = "💀 You Lost";
//     color = "text-red-600";
//   } else {
//     message = "🤝 Draw";
//     color = "text-yellow-600";
//   }

//   return (
//     <div className="flex items-center justify-center h-screen bg-[#050816]">
//       <h1 className={`text-4xl font-bold ${color}`}>{message}</h1>
//     </div>
//   );
// }