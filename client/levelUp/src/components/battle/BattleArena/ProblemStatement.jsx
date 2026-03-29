import { useEffect, useRef } from "react";
import { animateProblemIn } from "../../../utils/gsapAnimations";
import { getDifficultyColor } from "../../../utils/battleHelpers";

export default function ProblemStatement({ problem }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) animateProblemIn(panelRef.current);
  }, []);

  const diffColor = getDifficultyColor(problem.difficulty);

  return (
    <div ref={panelRef} className="flex flex-col h-full bg-[#0d1321]">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="px-2 py-[2px] text-xs border rounded uppercase font-bold"
            style={{
              color: diffColor,
              borderColor: `${diffColor}44`,
            }}
          >
            {problem.difficulty}
          </span>

          <span className="text-xs text-slate-400 font-mono">
            ⏳ {problem.complexity || "O(log n)"}
          </span>
        </div>

        <h2 className="text-lg font-bold">{problem.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-300">
        <p>{problem.description}</p>

        {(problem.examples || []).map((ex, i) => (
          <div key={i} className="border border-slate-800 rounded">
            <div className="px-3 py-1 text-xs uppercase bg-slate-900 border-b border-slate-800">
              Example {i + 1}
            </div>

            <div className="p-3 space-y-1 font-mono text-xs">
              <div>Input: {ex.input}</div>
              <div>Output: {ex.output}</div>
              {ex.explanation && <div>{ex.explanation}</div>}
            </div>
          </div>
        ))}

        <div>
          <div className="uppercase text-xs text-slate-400 mb-2">
            Constraints
          </div>

          <ul className="space-y-1 font-mono text-xs">
            {(problem.constraintsList || []).map((c, i) => (
              <li key={i}>▸ {c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
