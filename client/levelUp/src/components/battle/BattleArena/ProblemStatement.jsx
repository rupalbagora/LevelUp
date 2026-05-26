import { useEffect, useRef, useState } from "react";
import { animateProblemIn } from "../../../utils/gsapAnimations";
import { getDifficultyColor } from "../../../utils/battleHelpers";
import { FileText } from "lucide-react";

const TABS = [
  { id: "description", label: "Description", icon: <FileText size={12} /> }
  
];

/**
 * ProblemStatement
 * Props:
 *   problem  { title, description, difficulty, topic, examples, constraintsList, problemNumber }
 */
export default function ProblemStatement({ problem }) {
  const panelRef = useRef(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (panelRef.current) animateProblemIn(panelRef.current);
  }, []);

  const diffColor = getDifficultyColor(problem.difficulty);

  return (
    <div ref={panelRef} className="flex flex-col h-full bg-white dark:bg-[#1a1a1a]">
      {/* Tab Bar */}
      <div className="flex border-b border-slate-200 dark:border-[#3a3a3a] bg-slate-50 dark:bg-[#282828] select-none">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-medium transition-colors ${
              activeTab === id
                ? "text-[#2cbb5d] border-b-2 border-[#2cbb5d]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "description" && (
          <div className="p-5 space-y-5">
            {/* Title row */}
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {problem.problemNumber ? `${problem.problemNumber}. ` : ""}
                {problem.title}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2 py-0.5 text-[11px] rounded-full font-semibold"
                  style={{
                    color: diffColor,
                    backgroundColor: `${diffColor}18`,
                  }}
                >
                  {problem.difficulty}
                </span>
                {problem.topic && (
                  <span className="px-2 py-0.5 text-[11px] rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {problem.topic}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </p>

            {/* Examples */}
            {(problem.examples || []).map((ex, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-slate-200 dark:border-[#3a3a3a]">
                <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide bg-slate-100 dark:bg-[#282828] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#3a3a3a]">
                  Example {i + 1}
                </div>
                <div className="p-3 space-y-1 font-mono text-xs bg-white dark:bg-[#1e1e1e] text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Input: </span>
                    {ex.input}
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Output: </span>
                    {ex.output}
                  </div>
                  {ex.explanation && (
                    <div className="mt-1 text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Constraints */}
            {(problem.constraintsList || []).length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                  Constraints
                </h3>
                <ul className="space-y-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                  {problem.constraintsList.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2cbb5d] mt-0.5">▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
