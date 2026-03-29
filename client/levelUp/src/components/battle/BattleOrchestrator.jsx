import { useBattleSocket } from "../../hooks/useBattleSocket";
import MatchIntro from "./MatchIntro/MatchIntro";
import BattleArena from "./BattleArena/BattleArena";
import ResultsScreen from "./Results/ResultsScreen";

export default function BattleOrchestrator({ battleId, userId }) {
  const { battleState, startBattle, submitSolution, updateTypingStatus } =
    useBattleSocket(battleId, userId);

  const {
    phase,
    problem,
    players,
    opponentProgress,
    opponentStatus,
    result,
    isLoading,
  } = battleState;

  if (isLoading || !problem || !players) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 battle-bg font-semibold">
        <div className="w-10 h-10 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm tracking-widest uppercase text-slate-400">
          Connecting to battle...
        </span>
      </div>
    );
  }

  if (phase === "intro") {
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
        duration={600}
        onSubmit={(code, language) => submitSolution(code, language)}
        onCodeChange={(code) => updateTypingStatus(code)}
      />
    );
  }

  return (
    <ResultsScreen
      result={result}
      players={players}
      onPlayAgain={() => (window.location.href = "/")}
      onGoHome={() => (window.location.href = "/")}
    />
  );
}
