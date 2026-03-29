import { useEffect, useRef } from "react";
import {
  animateWinnerReveal,
  animateStatCountUp,
} from "../../../utils/gsapAnimations";
import {
  getInitials,
  getAvatarColor,
  formatTime,
} from "../../../utils/battleHelpers";

export default function ResultsScreen({
  result,
  players,
  onPlayAgain,
  onGoHome,
}) {
  const cardRef = useRef(null);
  const labelRef = useRef(null);
  const timeRef = useRef(null);

  const isWinner = result?.isWinner;
  const winnerUsername = result?.winnerUsername || players?.current?.username;

  useEffect(() => {
    if (cardRef.current && labelRef.current) {
      animateWinnerReveal(cardRef.current, labelRef.current);
    }

    if (timeRef.current && result?.timeTaken) {
      setTimeout(() => {
        animateStatCountUp(timeRef.current, result.timeTaken, "s");
      }, 600);
    }
  }, []);

  const winnerColor = getAvatarColor(winnerUsername);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#080c14] gap-8">
      <div ref={labelRef} className="text-4xl font-bold">
        {isWinner ? (
          <span className="text-yellow-400">🏆 Victory!</span>
        ) : (
          <span className="text-slate-500">💀 Defeated</span>
        )}
      </div>

      <div
        ref={cardRef}
        className="flex flex-col items-center gap-4 p-10 bg-[#0d1321] border border-slate-800 rounded-xl"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl text-white font-bold"
          style={{
            background: `linear-gradient(135deg, ${winnerColor}cc, ${winnerColor}44)`,
          }}
        >
          {getInitials(winnerUsername)}
        </div>

        <h2 className="text-xl font-bold">{winnerUsername}</h2>
      </div>

      <div className="flex gap-6">
        <div className="text-center">
          <div ref={timeRef} className="text-lg font-mono">
            {result?.timeTaken ? formatTime(result.timeTaken) : "--"}
          </div>

          <div className="text-xs text-slate-400">Time Taken</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {result?.correct ? "Accepted" : "Wrong"}
          </div>

          <div className="text-xs text-slate-400">Result</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded font-bold"
        >
          Play Again
        </button>

        <button
          onClick={onGoHome}
          className="px-6 py-2 border border-slate-600 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}
