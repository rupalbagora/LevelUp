
import { useBattleSocket } from "../../hooks/useBattleSocket";
import MatchIntro from "./MatchIntro/MatchIntro";
import BattleArena from "./BattleArena/BattleArena";
import ResultsScreen from "./Results/ResultsScreen";
import { useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { joinBattleAPI } from "../../services/battleService";

export default function BattleOrchestrator() {
  const { battleId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  const joinAttempted = useRef(false);

  // This callback fires the moment the socket connects and joins the room
  const handleSocketReady = useCallback(() => {
    if (joinAttempted.current) return;
    joinAttempted.current = true;

    console.log("🚀 Socket ready — calling joinBattleAPI");

    joinBattleAPI(battleId)
      .then((data) => {
        console.log("✅ Join response:", data);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "";
        if (
          msg !== "Cannot join your own battle" &&
          msg !== "Battle already started"
        ) {
          console.error("❌ Join error:", msg);
        } else {
          console.log("ℹ️ Join silenced:", msg);
        }
      });
  }, [battleId]);

  const { battleState, startBattle, submitSolution, updateTypingStatus } =
    useBattleSocket(battleId, userId, handleSocketReady);
  // ↑ pass callback directly into the hook

  const { phase, problem, players, opponentProgress, opponentStatus, result, isLoading } =
    battleState;

  if (phase === "waiting") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#050816]">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm tracking-widest uppercase text-slate-400 font-semibold">
          Waiting for opponent to join...
        </span>
      </div>
    );
  }

  if (isLoading || !problem) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#050816]">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm tracking-widest uppercase text-slate-400 font-semibold">
          Loading battle...
        </span>
      </div>
    );
  }

  if (phase === "intro" && players) {
    return <MatchIntro players={players} onComplete={() => startBattle()} />;
  }

  if (phase === "battle" && !result) {
    return (
      <BattleArena
        problem={problem}
        currentUser={players.current}
        opponent={players.opponent}
        opponentProgress={opponentProgress}
        opponentStatus={opponentStatus}
        duration={1800}
        onSubmit={(code, language) => submitSolution(code, language)}
        onCodeChange={(code) => updateTypingStatus(code)}
      />
    );
  }

  if (result) {
    return (
      <ResultsScreen
        result={result}
        players={players}
        onPlayAgain={() => (window.location.href = "/")}
        onGoHome={() => (window.location.href = "/")}
      />
    );
  }

  return null;
}