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
    <header className="flex items-center justify-between h-14 px-5 bg-[#0d1321] border-b border-slate-800">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-500/10 border border-blue-500/30 rounded">
          ⚔
        </div>

        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Battle Arena
          </span>

          <span className="flex items-center gap-1 font-bold">
            {topic}
            <span className="w-[3px] h-[3px] bg-slate-400 rounded-full" />
            <span style={{ color: diffColor }}>{difficulty}</span>
          </span>
        </div>
      </div>

      <div
        ref={timerRef}
        className={`flex items-center gap-2 px-4 py-1 rounded font-mono text-lg
        ${isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : ""}`}
      >
        ⏱ {formatted}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onHint}
          disabled={hintsRemaining === 0}
          className="px-3 py-1 rounded border border-orange-400/40 text-orange-400 hover:bg-orange-500/10 text-sm font-semibold"
        >
          ⚡ Hint ({hintsRemaining})
        </button>

        <button
          ref={submitRef}
          onClick={handleSubmit}
          className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm"
        >
          ✓ Submit
        </button>
      </div>
    </header>
  );
}
