import { useState } from "react";
import { Lightbulb, Sparkles, Zap, AlignLeft } from "lucide-react";

// Separate Mock Data for different hint types
const MOCK_ONE_LINERS = [
  "Use two pointers to traverse both lists simultaneously.",
  "Keep track of the 'carry' value in each step.",
  "Initialize a dummy head for the result list."
];

const MOCK_DETAILED = [
  "Detailed: Create a 'carry' variable starting at 0. While l1 or l2 exists, add their values plus carry. Use sum % 10 for the new node and sum / 10 for the next carry.",
  "Detailed: Handle lists of different lengths by treating null nodes as 0. After the loop, if carry > 0, append a final node with the carry value.",
  "Detailed: Time complexity will be O(max(N, M)). Space complexity is O(max(N, M)) to store the new sum linked list."
];

let oneLineIdx = 0;
let detailedIdx = 0;

export default function AIHintPanel({ code = "", hintsRemaining = 3, onHintUsed }) {
  const [hint, setHint] = useState(null);
  const [currentType, setCurrentType] = useState(null); // 'quick' | 'detailed'
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGetHint(type) {
    if (hintsRemaining <= 0) return;

    if (!code.trim()) {
      setHint(null);
      setError("Please write some code first to get a specific hint.");
      return;
    }

    setError(null);
    setHint(null);
    setCurrentType(type);
    setIsHintLoading(true);
    
    // Parent component function to reduce hint count
    onHintUsed?.();

    // AI thinking simulation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (type === "quick") {
      setHint(MOCK_ONE_LINERS[oneLineIdx % MOCK_ONE_LINERS.length]);
      oneLineIdx++;
    } else {
      setHint(MOCK_DETAILED[detailedIdx % MOCK_DETAILED.length]);
      detailedIdx++;
    }

    setIsHintLoading(false);
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
        
        {/* Count Badge - Rewards will increase this */}
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