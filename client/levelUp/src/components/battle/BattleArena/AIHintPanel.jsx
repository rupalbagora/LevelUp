import { useState } from "react";
import { Lightbulb, Sparkles, Zap, AlignLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom"; 
import { fetchAIHint } from "../../../services/hintService"; 

export default function AIHintPanel({ code = "", hintsRemaining = 3, onHintUsed, problemStatement }) {
  const { battleId } = useParams(); 
  const [hint, setHint] = useState(null);
  const [currentType, setCurrentType] = useState(null); 
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGetHint(type) {
    if (hintsRemaining <= 0) return;

    if (!code.trim()) {
      setError("Please write some code first to get a specific hint.");
      return;
    }

    setError(null);
    setIsHintLoading(true);

    try {
      // REAL API CALL - Gemini se data yahan aayega
      const data = await fetchAIHint(battleId, code, problemStatement, type);
      
      setHint(data.hint);
      setCurrentType(type);
      
      // Parent component (BattleArena) ko signal dena count kam karne ke liye
      onHintUsed?.(); 
      
    } catch (err) {
      setError(err.response?.data?.message || "AI is taking a break. Try again!");
    } finally {
      setIsHintLoading(false);
    }
  }

  return (
    <div className="p-4 border-b border-slate-200 dark:border-[#3a3a3a] bg-white dark:bg-[#282828]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Lightbulb size={18} className="text-purple-500 dark:text-purple-400 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">AI Assistant</span>
        </div>
        
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
           <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
            {hintsRemaining} HINTS LEFT
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 italic">
        Winning battles can earn you more hints! 🎁
      </p>

      {/* Two-Button Layout */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => handleGetHint("quick")}
          disabled={isHintLoading || hintsRemaining <= 0}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white disabled:opacity-50"
        >
          <Zap size={13} className="text-yellow-400 fill-current" />
          Quick Tip
        </button>

        <button
          onClick={() => handleGetHint("detailed")}
          disabled={isHintLoading || hintsRemaining <= 0}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all bg-[#ffa116] hover:bg-[#e8920f] text-white disabled:opacity-50"
        >
          <AlignLeft size={13} />
          Detailed
        </button>
      </div>

      {/* LIMIT MESSAGE */}
      {hintsRemaining === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 border-t-2 border-dashed border-rose-500/30 bg-rose-500/5 text-center"
        >
          <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest">
            🚫 HINT LIMIT DONE: NO MORE HINTS TO TAKE!
          </p>
          <p className="text-[9px] text-slate-400 mt-1">
            Use your own logic now, Warrior! ⚔️
          </p>
        </motion.div>
      )}

      {/* Error / Loading / Hint Text */}
      {error && !isHintLoading && (
        <p className="mt-3 text-[11px] text-amber-600 text-center">{error}</p>
      )}

      {isHintLoading && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <Sparkles size={16} className="text-purple-500 animate-spin" />
          <p className="text-[10px] text-slate-400">AI is analyzing your logic...</p>
        </div>
      )}

      {hint && !isHintLoading && (
        <div className="mt-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                {currentType === 'quick' ? 'Quick Logic' : 'Deep Breakdown'}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {hint}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}