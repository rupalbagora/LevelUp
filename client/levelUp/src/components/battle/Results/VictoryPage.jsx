import {
  Trophy,
  Skull,
  Handshake,
  RotateCcw,
  Home,
} from "lucide-react";

export default function VictoryResultScreen({
  result,
  players,
  onPlayAgain,
  onGoHome,
}) {
  if (!result) return null;

  let message;
  let color;
  let Icon;

  if (result.status === "winner") {
    message = "Victory!";
    color = "text-green-400";
    Icon = Trophy;
  } else if (result.status === "defeated") {
    message = "Defeat";
    color = "text-red-400";
    Icon = Skull;
  } else {
    message = "Draw";
    color = "text-yellow-400";
    Icon = Handshake;
  }

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      <div className="w-full max-w-3xl bg-[#0B1120] border border-slate-800 rounded-3xl p-10 shadow-2xl">

        {/* RESULT HEADER */}
        <div className="flex flex-col items-center text-center">

          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6
            ${
              result.status === "winner"
                ? "bg-green-500/10"
                : result.status === "defeated"
                ? "bg-red-500/10"
                : "bg-yellow-500/10"
            }`}
          >
            <Icon className={`w-12 h-12 ${color}`} />
          </div>

          <h1 className={`text-5xl font-black mb-3 ${color}`}>
            {message}
          </h1>

          <p className="text-slate-400 text-lg">
            Battle completed successfully
          </p>
        </div>

        {/* DIVIDER */}
        <div className="my-10 border-t border-slate-800" />

        {/* BATTLE INFO */}
        <div className="space-y-6">

          <div>
            <p className="text-sm text-slate-500 mb-1">
              Opponent
            </p>

            <h2 className="text-2xl font-bold text-white">
              {players?.opponent?.username || "Unknown Player"}
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-1">
              Problem
            </p>

            <h2 className="text-2xl font-bold text-white">
              {result?.problem?.title || "Coding Challenge"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">

            <div className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold">
              {result?.problem?.difficulty || "Medium"}
            </div>

            <div className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold">
              {result?.problem?.topic || "Arrays"}
            </div>

          </div>
        </div>

        {/* OPTIONAL STATS */}
        {result?.submission && (
          <div className="grid grid-cols-2 gap-4 mt-10">

            <div className="bg-[#111827] rounded-2xl p-5 border border-slate-800">
              <p className="text-slate-500 text-sm mb-1">
                Runtime
              </p>

              <h3 className="text-2xl font-bold text-white">
                {result.submission.runtimeMs || 0} ms
              </h3>
            </div>

            <div className="bg-[#111827] rounded-2xl p-5 border border-slate-800">
              <p className="text-slate-500 text-sm mb-1">
                Memory
              </p>

              <h3 className="text-2xl font-bold text-white">
                {result.submission.memoryUsedKb || 0} KB
              </h3>
            </div>

          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4 mt-10">

          <button
            onClick={onPlayAgain}
            className="flex-1 bg-blue-600 hover:bg-blue-500 transition-all py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Play Again
          </button>

          <button
            onClick={onGoHome}
            className="flex-1 bg-slate-800 hover:bg-slate-700 transition-all py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go Home
          </button>

        </div>

      </div>
    </div>
  );
}
