import { useEffect, useRef, useState, useCallback } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { animateArenaIn } from "../../../utils/gsapAnimations";
import { useBattleTimer } from "../../../hooks/useBattleTimer";
import { usePanelResize, useVerticalResize } from "../../../hooks/usePanelResize";


import BattleHeader from "./BattleHeader";
import ProblemStatement from "./ProblemStatement";
import CodeEditor from "./CodeEditor";
import ConsolePanel from "./ConsolePanel";
import AIHintPanel from "./AIHintPanel";
import OpponentPanel from "./OpponentPanel";

// Default column widths (%)
const DEFAULT_COLS = [30, 45, 25];

/**
 * DragHandle — vertical divider that can be dragged left/right
 */
function DragHandle({ onMouseDown }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="
        relative w-1 flex-shrink-0 cursor-col-resize
        bg-slate-200 dark:bg-[#3a3a3a]
        hover:bg-[#7000ff]/60 active:bg-[#7000ff]
        transition-colors duration-150
        group
      "
      title="Drag to resize"
    >
      {/* Invisible wider hit target */}
      <div className="absolute inset-y-0 -left-1 -right-1 z-10" />
      {/* Visible dots indicator */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {[0,1,2].map(i => (
          <div key={i} className="w-0.5 h-0.5 rounded-full bg-[#7000ff]" />
        ))}
      </div>
    </div>
  );
}

/**
 * HorizontalDragHandle — for editor/console split
 */
function HorizontalDragHandle({ onMouseDown }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="
        relative h-1 flex-shrink-0 cursor-row-resize
        bg-slate-200 dark:bg-[#3a3a3a]
        hover:bg-[#7000ff]/60 active:bg-[#7000ff]
        transition-colors duration-150
        group
      "
      title="Drag to resize"
    >
      <div className="absolute inset-x-0 -top-1 -bottom-1 z-10" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {[0,1,2].map(i => (
          <div key={i} className="h-0.5 w-0.5 rounded-full bg-[#7000ff]" />
        ))}
      </div>
    </div>
  );
}

/**
 * PanelMaximizeBtn — top-right maximize/restore button
 */
function PanelMaximizeBtn({ isMax, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="
        p-1 rounded text-slate-400 dark:text-slate-500
        hover:text-slate-700 dark:hover:text-white
        hover:bg-slate-100 dark:hover:bg-slate-700
        transition-colors
      "
      title={isMax ? "Restore panel" : "Maximize panel"}
    >
      {isMax ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
  const [language, setLanguage] = useState("python3");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [testResults, setTestResults] = useState([]);

  // Which panel is maximized: null | "left" | "center" | "right"
  const [maximized, setMaximized] = useState(null);

  const timer = useBattleTimer(duration, { onExpire: () => handleTimerExpire() });

  // Horizontal column resize
  const { sizes: cols, startDrag: startColDrag, setSizes: setCols } = usePanelResize(DEFAULT_COLS, 15);

  // Vertical editor/console resize (inside center panel)
  const { topPercent: editorPercent, startDrag: startRowDrag } = useVerticalResize(62, 25, 82);

  useEffect(() => {
    if (arenaRef.current) animateArenaIn(arenaRef.current);
  }, []);

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      onCodeChange?.(newCode);
    },
    [onCodeChange]
  );

  function handleLanguageChange(lang) {
    setLanguage(lang);
  }

  function handleSubmit() {
    if (!code.trim()) return;
    const payload = {
      userId: currentUser.userId,
      problemId: problem.id || "unknown",
      code,
      language,
    };
    console.log("[BattleArena] Submit payload:", payload);
    setSubmissionStatus("pending");
    onSubmit?.(code, language);
    setTimeout(() => setSubmissionStatus("correct"), 1500);
  }

  function handleRun(testCase) {
    if (!code.trim()) return;
    setTimeout(() => {
      setTestResults((prev) => {
        const existing = prev.filter((r) => r.caseId !== testCase.id);
        return [
          ...existing,
          { caseId: testCase.id, passed: Math.random() > 0.4, actual: testCase.expected },
        ];
      });
    }, 800);
  }

  function handleHintUsed() {
    setHintsRemaining((h) => Math.max(0, h - 1));
  }

  function handleTimerExpire() {
    if (code.trim()) handleSubmit();
  }

  // Toggle maximized panel. If already max, restore. Otherwise restore cols too.
  function toggleMax(panel) {
    if (maximized === panel) {
      setMaximized(null);
      setCols(DEFAULT_COLS); // restore defaults on minimize
    } else {
      setMaximized(panel);
    }
  }

  // Compute effective column sizes
  // When a panel is maximized, it gets 96% and the others share 2% each (hidden)
  function getColStyle(panel) {
    if (!maximized) {
      return {
        width: `${cols[["left","center","right"].indexOf(panel)]}%`,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      };
    }
    if (maximized === panel) {
      return {
        flex: "1 1 auto",
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      };
    }
    // Hidden panels
    return { width: 0, minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" };
  }

  const panelNames = ["left", "center", "right"];

  return (
    <div
      ref={arenaRef}
      className="flex flex-col h-screen bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-slate-200 overflow-hidden"
    >
      <BattleHeader
        topic={problem.topic}
        difficulty={problem.difficulty}
        formatted={timer.formatted}
        isWarning={timer.isWarning}
        isCritical={timer.isCritical}
        hintsRemaining={hintsRemaining}
        onSubmit={handleSubmit}
        onHint={() => {}}
      />

      {/* 3-panel grid row */}
      <div
        id="battle-arena-grid"
        className="flex flex-1 overflow-hidden"
      >

        {/* ── LEFT: Problem Statement ── */}
        <div style={getColStyle("left")} className="border-r border-slate-200 dark:border-[#3a3a3a]">
          {/* Panel header bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 dark:border-[#3a3a3a] bg-slate-50 dark:bg-[#282828] flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Problem</span>
            <PanelMaximizeBtn isMax={maximized === "left"} onToggle={() => toggleMax("left")} />
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <ProblemStatement problem={problem} />
          </div>
        </div>

        {/* Divider 1 */}
        {!maximized && <DragHandle onMouseDown={(e) => startColDrag(0, e)} />}

        {/* ── CENTER: Editor + Console ── */}
        <div id="center-panel" style={getColStyle("center")} className="border-r border-slate-200 dark:border-[#3a3a3a]">
          {/* Panel header bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 dark:border-[#3a3a3a] bg-slate-50 dark:bg-[#282828] flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Code Editor</span>
            <PanelMaximizeBtn isMax={maximized === "center"} onToggle={() => toggleMax("center")} />
          </div>

          {/* Editor */}
          <div style={{ height: `${editorPercent}%`, minHeight: 0 }} className="overflow-hidden flex-shrink-0">
            <CodeEditor
              language={language}
              onLanguageChange={handleLanguageChange}
              onChange={handleCodeChange}
              onMount={(editor) => (editorRef.current = editor)}
              submissionStatus={submissionStatus}
              username={currentUser.username}
            />
          </div>

          {/* Horizontal drag divider */}
          <HorizontalDragHandle onMouseDown={startRowDrag} />

          {/* Console */}
          <div style={{ height: `${100 - editorPercent}%`, minHeight: 0 }} className="overflow-hidden flex-shrink-0">
            <ConsolePanel
              code={code}
              onRun={handleRun}
              onSubmit={handleSubmit}
              testResults={testResults}
            />
          </div>
        </div>

        {/* Divider 2 */}
        {!maximized && <DragHandle onMouseDown={(e) => startColDrag(1, e)} />}

        {/* ── RIGHT: AI Hint + Opponent ── */}
        <div style={getColStyle("right")}>
          {/* Panel header bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 dark:border-[#3a3a3a] bg-slate-50 dark:bg-[#282828] flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">AI & Opponent</span>
            <PanelMaximizeBtn isMax={maximized === "right"} onToggle={() => toggleMax("right")} />
          </div>

          <div className="flex-shrink-0">
            <AIHintPanel
  code={code}
  hintsRemaining={hintsRemaining}
  onHintUsed={handleHintUsed}
  problemStatement={problem.description || problem.topic} // Ye line add ki taaki AI ko context mile
/>
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            <OpponentPanel
              opponent={opponent}
              progress={opponentProgress}
              status={opponentStatus}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
