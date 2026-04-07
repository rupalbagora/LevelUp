import { useEffect, useRef, useState } from "react";
import PlayerCard from "./PlayerCard";

import {
  animatePlayersIn,
  animateVSPulse,
  animateCountdownNumber,
  animateFightBanner,
} from "../../../utils/gsapAnimations";

export default function MatchIntro({ players, onComplete }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const vsRef = useRef(null);

  const countRef = useRef(null);
  const fightRef = useRef(null);
  const flashRef = useRef(null);

  const vsPulseAnim = useRef(null);

  const [countNum, setCountNum] = useState(null);
  const [showFight, setShowFight] = useState(false);

  useEffect(() => {
    animatePlayersIn(leftRef.current, rightRef.current, vsRef.current, () => {
      vsPulseAnim.current = animateVSPulse(vsRef.current);
      runCountdown(3);
    });

    return () => {
      vsPulseAnim.current?.kill();
    };
  }, []);

  function runCountdown(n) {
    if (n === 0) {
      vsPulseAnim.current?.kill();
      setShowFight(true);
      setCountNum(null);
      return;
    }

    setCountNum(n);

    requestAnimationFrame(() => {
      if (countRef.current) {
        animateCountdownNumber(countRef.current, () => runCountdown(n - 1));
      }
    });
  }

  useEffect(() => {
    if (showFight && fightRef.current && flashRef.current) {
      animateFightBanner(fightRef.current, flashRef.current, () =>
        onComplete?.(),
      );
    }
  }, [showFight]);

  // MatchIntro.jsx ke return statement mein ye change karein
// MatchIntro.jsx
// MatchIntro.jsx
// MatchIntro.jsx
return (
  /* 'bg-slate-100' use kiya hai taaki background bright gray lage, na ki white. dark mode pe 'dark:bg-[#050816]' rakha hai. */
  <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-slate-100 dark:bg-[#050816] transition-colors duration-500 relative overflow-hidden">
    <div
      ref={flashRef}
      className="absolute inset-0 bg-white opacity-0 z-50 pointer-events-none"
    />

    <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-32 z-10 w-full max-w-7xl px-10">
      {/* Left Player */}
      <div ref={leftRef} className="flex-1 flex justify-end">
        {players?.current && (
          <PlayerCard player={players.current} side="left" />
        )}
      </div>

      {/* Center Section */}
      <div className="flex flex-col items-center justify-center min-w-[300px]">
        {/* VS Text: Iska color update kiya hai taaki slate-100 par halka sa dikhe. */}
        <div
          ref={vsRef}
          className="text-7xl md:text-9xl font-black tracking-tighter text-slate-500 dark:text-white/10 italic absolute select-none"
        >
          VS
        </div>

        <div className="relative h-40 flex items-center justify-center">
          {countNum !== null && (
            /* Countdown: Light gray bg ke hisaab se thoda bold aur deep cyan. */
            <div
              ref={countRef}
              className="text-8xl md:text-[12rem] font-black text-[#0891B2] dark:text-cyan-400 drop-shadow-md dark:drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]"
            >
              {countNum}
            </div>
          )}

          {showFight && (
            <div
              ref={fightRef}
              className="text-7xl md:text-9xl font-black text-red-600 dark:text-red-500 drop-shadow-md dark:drop-shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            >
              FIGHT!
            </div>
          )}
        </div>
      </div>

      {/* Right Player */}
      <div ref={rightRef} className="flex-1 flex justify-start">
        <PlayerCard player={players.opponent} side="right" />
      </div>
    </div>
  </div>
);
}
