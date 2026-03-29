import { useEffect, useRef, useState } from "react";
import { animateArenaIn } from "../../../utils/gsapAnimations";
import { useBattleTimer } from "../../../hooks/useBattleTimer";

import BattleHeader from "./BattleHeader";
import ProblemStatement from "./ProblemStatement";
import CodeEditor from "./CodeEditor";
import OpponentPanel from "./OpponentPanel";

export default function BattleArena({
  problem,
  currentUser,
  opponent,
  opponentProgress,
  opponentStatus,
  duration = 600,
  onSubmit,
  onCodeChange,
}) {
  const arenaRef = useRef(null);
  const editorRef = useRef(null);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  const timer = useBattleTimer(duration, {
    onExpire: () => handleTimerExpire(),
  });

  useEffect(() => {
    if (arenaRef.current) animateArenaIn(arenaRef.current);
  }, []);

  function handleCodeChange(newCode) {
    setCode(newCode);
    onCodeChange?.(newCode);
  }

  function handleSubmit() {
    if (!code.trim()) return;

    setSubmissionStatus("pending");
    onSubmit?.(code, language);

    setTimeout(() => {
      setSubmissionStatus("correct");
    }, 1500);
  }

  function handleHint() {
    if (hintsRemaining <= 0) return;
    setHintsRemaining((h) => h - 1);
  }

  function handleTimerExpire() {
    if (code.trim()) handleSubmit();
  }

  return (
    <div
      ref={arenaRef}
      className="flex flex-col h-screen bg-[#080c14] text-slate-200"
    >
      <BattleHeader
        topic={problem.topic}
        difficulty={problem.difficulty}
        formatted={timer.formatted}
        isWarning={timer.isWarning}
        isCritical={timer.isCritical}
        hintsRemaining={hintsRemaining}
        onSubmit={handleSubmit}
        onHint={handleHint}
      />
      
      <div className="grid grid-cols-[28%_1fr_26%] h-full">
        <div className="border-r border-slate-800 overflow-hidden">
          <ProblemStatement problem={problem} />
        </div>

        <div className="border-r border-slate-800 overflow-hidden">
          <CodeEditor
            language={language}
            onLanguageChange={(lang) => {
              setLanguage(lang);
              setCode("");
            }}
            onChange={handleCodeChange}
            onMount={(editor) => (editorRef.current = editor)}
            submissionStatus={submissionStatus}
            username={currentUser.username}
          />
        </div>

        <div className="overflow-hidden">
          <OpponentPanel
            opponent={opponent}
            progress={opponentProgress}
            status={opponentStatus}
          />
        </div>
      </div>
    </div>
  );
}
