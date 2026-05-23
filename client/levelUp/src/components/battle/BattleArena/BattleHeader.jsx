import { useEffect, useRef } from "react";
import {
  animateTimerWarning,
  animateTimerPulse,
  animateSubmitClick,
} from "../../../utils/gsapAnimations";
import { getDifficultyColor } from "../../../utils/battleHelpers";

export default function BattleHeader({
  topic,
  difficulty,
  formatted,
  isWarning,
  isCritical,
  hintsRemaining = 3,
  onSubmit,
  onHint,
}) {
  const timerRef = useRef(null);
  const submitRef = useRef(null);
  const prevFormatted = useRef(formatted);
  const warningFired = useRef(false);

  useEffect(() => {
    if (prevFormatted.current !== formatted && timerRef.current) {
      animateTimerPulse(timerRef.current);
      prevFormatted.current = formatted;
    }
  }, [formatted]);

  useEffect(() => {
    if (isWarning && !warningFired.current && timerRef.current) {
      warningFired.current = true;
      animateTimerWarning(timerRef.current);
    }
  }, [isWarning]);

  function handleSubmit() {
    if (submitRef.current) animateSubmitClick(submitRef.current);
    onSubmit?.();
  }

  const diffColor = getDifficultyColor(difficulty);

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-slate-50 dark:bg-[#282828] border-b border-slate-200 dark:border-[#3a3a3a] flex-shrink-0 select-none">
      {/* Left: branding + problem info */}
      <div className="flex items-center gap-4">
        <div className="text-[#7000ff] font-bold tracking-tighter text-base">
          LEVEL UP
        </div>
        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
            {topic}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ color: diffColor, backgroundColor: `${diffColor}18` }}
          >
            {difficulty}
          </span>
        </div>
      </div>

      {/* Center: Timer */}
      <div
        ref={timerRef}
        className={`font-mono text-sm font-bold px-3 py-1 rounded-md border ${
          isCritical
            ? "text-red-500 border-red-500/30 bg-red-500/10 animate-pulse"
            : isWarning
            ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
            : "text-emerald-500 dark:text-emerald-400 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#1e2536]"
        }`}
      >
        {formatted}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onHint}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#ffa116] transition-colors font-medium"
        >
          Hints ({hintsRemaining})
        </button>
        <button
          ref={submitRef}
          onClick={handleSubmit}
          className="ml-1 px-4 py-1.5 bg-[#2cbb5d] hover:bg-[#25a050] active:scale-95 text-white rounded text-xs font-bold transition-all duration-150"
        >
          Submit
        </button>
      </div>
    </header>
  );
}