import { useEffect, useRef } from "react";
import {
  animateOpponentIn,
  animateProgressBar,
} from "../../../utils/gsapAnimations";
import {
  getInitials,
  getAvatarColor,
  getRankInfo,
} from "../../../utils/battleHelpers";

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

  const initials = getInitials(opponent.username);
  const avatarColor = getAvatarColor(opponent.username);
  const rankInfo = getRankInfo(opponent.rank);

  return (
    <div ref={panelRef} className="flex flex-col h-full bg-[#0d1321]">
      <div className="flex justify-between items-center p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${avatarColor}cc, ${avatarColor}44)`,
            }}
          >
            {initials}
          </div>

          <div className="flex flex-col text-sm">
            <span>{opponent.username}</span>
            <span style={{ color: rankInfo.color }}>
              {rankInfo.icon} {opponent.rank}
            </span>
          </div>
        </div>

        <span className="text-xs text-slate-400">{status}</span>
      </div>

      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Opponent code hidden 👁
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-slate-800 rounded">
          <div
            ref={barRef}
            className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
