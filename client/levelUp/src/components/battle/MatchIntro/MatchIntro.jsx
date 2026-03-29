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

  return (
    <div className="fixed inset-0 flex items-center justify-center battle-bg">
      <div ref={flashRef} className="absolute inset-0 bg-white opacity-0" />

      <div className="flex items-center gap-12">
        <div ref={leftRef}>
          <PlayerCard player={players.current} side="left" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div
            ref={vsRef}
            className="text-5xl font-bold tracking-widest text-white"
          >
            VS
          </div>

          {countNum !== null && (
            <div ref={countRef} className="text-6xl font-bold">
              {countNum}
            </div>
          )}

          {showFight && (
            <div ref={fightRef} className="text-6xl font-black text-red-500">
              FIGHT!
            </div>
          )}
        </div>

        <div ref={rightRef}>
          <PlayerCard player={players.opponent} side="right" />
        </div>
      </div>
    </div>
  );
}
