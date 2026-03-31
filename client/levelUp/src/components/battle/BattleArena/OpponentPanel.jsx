import { useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import {
  animateOpponentIn,
  animateProgressBar,
} from "../../../utils/gsapAnimations";
import { getRankInfo } from "../../../utils/battleHelpers";

/**
 * OpponentPanel
 * Right panel bottom section — shows opponent info and blurred code preview.
 * Props:
 *   opponent  { username, rank }
 *   progress  {number}  0-100
 *   status    {string}  "coding" | "typing" | "reviewing"
 */
export default function OpponentPanel({
  opponent,
  progress = 0,
  status = "coding",
}) {
  const panelRef = useRef(null);
  const barRef = useRef(null);
  const prevProgress = useRef(0);

  useEffect(() => {
    if (panelRef.current) animateOpponentIn(panelRef.current);
  }, []);

  useEffect(() => {
    if (barRef.current && progress !== prevProgress.current) {
      animateProgressBar(barRef.current, progress);
      prevProgress.current = progress;
    }
  }, [progress]);

  const rankInfo = getRankInfo(opponent.rank);

  // TODO: receive opponent code via socket.on('opponent_code_update', (data) => setOpponentCode(data.code))
  const FAKE_CODE_LINES = [
    "class Solution:",
    "    def addTwoNumbers(",
    "        self, l1, l2",
    "    ):",
    "        carry = 0",
    "        dummy = ListNode(0)",
    "        cur = dummy",
    "        while l1 or l2:",
    "            val = carry",
  ];

  const statusColor = {
    coding: "text-emerald-500",
    typing: "text-yellow-400",
    reviewing: "text-blue-400",
  }[status] || "text-emerald-500";

  return (
    <div ref={panelRef} className="flex flex-col h-full bg-white dark:bg-[#1a1a1a]">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-[#3a3a3a] bg-slate-50 dark:bg-[#282828] flex-shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Live Opponent
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className={`text-[10px] font-bold uppercase ${statusColor}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Avatar + info */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-[#3a3a3a]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md">
          {opponent.username[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            {opponent.username}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {rankInfo.icon} {opponent.rank}
          </p>
        </div>
      </div>

      {/* Blurred code preview */}
      <div className="flex-1 px-3 py-3 overflow-hidden relative">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
          Code Preview
        </p>

        {/* The blurred code — socket-ready stub */}
        <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-[#3a3a3a] bg-[#1e1e1e]">
          {/* Fake code lines (blurred) */}
          <div
            className="p-3 font-mono text-xs text-slate-200 space-y-1 blur-code"
            aria-hidden="true"
          >
            {FAKE_CODE_LINES.map((line, i) => (
              <div key={i} style={{ paddingLeft: `${(line.length - line.trimStart().length) * 6}px` }}>
                {line.trim()}
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-[2px]">
            <Lock size={18} className="text-slate-300" />
            <p className="text-[11px] font-semibold text-slate-200 text-center px-4 leading-snug">
              Code hidden during battle
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-[#3a3a3a] bg-slate-50 dark:bg-[#282828] flex-shrink-0">
        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500 mb-1.5">
          <span>Completion</span>
          <span className="text-blue-500 dark:text-blue-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}