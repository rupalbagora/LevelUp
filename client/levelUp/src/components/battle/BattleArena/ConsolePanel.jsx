import { useState } from "react";
import { Play, Send, Plus, CheckCircle, XCircle, Terminal } from "lucide-react";
/**
 * ConsolePanel
 * Bottom half of the center panel.
 * Props:
 * code           {string}   - current editor code (for empty-code guard)
 * onRun          {fn}       - called with selected testcase
 * onSubmit       {fn}       - called to trigger final submit
 * testResults    {array}    - [{caseId, passed, actual}]
 */
export default function ConsolePanel({
  code = "",
  onRun,
  onSubmit,
  testResults = [],
  testCases = [],
}) {
  const [activeTab, setActiveTab] = useState("testcase"); // "testcase" | "result"
  const [selectedCase, setSelectedCase] = useState(1);
  const [customCases, setCustomCases] = useState([]);
  

  // const allCases = [...MOCK_TESTCASES, ...customCases];
  const allCases = testCases.map((t, index) => ({
    id: index + 1,
    label: `Case ${index + 1}`,
    input: t.input,
    expected: t.output,
  }));
 const currentCase =
   allCases.find((c) => c.id === selectedCase) || allCases[0] || null;

  function handleAddCase() {
    // 3-case limit for custom inputs
    if (customCases.length >= 3) {
      alert("You can only add up to 3 custom test cases.");
      return;
    }
    const newId = allCases.length + 1;
    setCustomCases((prev) => [
      ...prev,
      {
        id: newId,
        label: `Case ${newId}`,
        inputs: { l1: "[2,4,3]", l2: "[5,6,4]" }, // Default structure
        expected: "",
        isCustom: true,
      },
    ]);
    setSelectedCase(newId);
  }

  function handleRun() {
    if (!code.trim()) return;
    setActiveTab("result");
    onRun?.(currentCase);
  }

  function handleSubmit() {
    if (!code.trim()) return;
    onSubmit?.();
  }

  const caseResult = testResults.find((r) => r.caseId === selectedCase);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1a1a1a] border-t border-slate-200 dark:border-[#3a3a3a]">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-slate-200 dark:border-[#3a3a3a] bg-slate-50 dark:bg-[#282828] px-3 select-none">
        {["testcase", "result"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-3 text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-[#2cbb5d] border-b-2 border-[#2cbb5d]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab === "testcase" ? "Testcase" : "Test Result"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "testcase" ? (
          <div>
            {/* Case tabs row WITH Action Buttons */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-1">
                {allCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      selectedCase === c.id
                        ? "bg-slate-200 dark:bg-[#3a3a3a] text-slate-800 dark:text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#333]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}

                {/* + Button for Custom Input */}
                <button
                  onClick={handleAddCase}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  title="Add test case"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Run & Submit Buttons right here */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={!code.trim()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#3a3a3a] text-white text-[11px] font-bold hover:bg-[#4a4a4a] transition-all disabled:opacity-40"
                >
                  <Play size={10} className="fill-current" />
                  Run
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!code.trim()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#16e85f] text-white text-[11px] font-bold hover:bg-[#14eb5f] transition-all disabled:opacity-40"
                >
                  <Send size={10} className="fill-current" />
                  Submit
                </button>
              </div>
            </div>

            {/* Inputs Section */}
            {allCases.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-4">
                No test cases available
              </div>
            ) : (
              <div className="space-y-3 text-xs font-mono">
                {/* 🔥 INPUT */}
                <div>
                  <p className="text-slate-400 mb-1 font-bold">Input</p>
                  <div className="bg-[#3a3a3a] rounded px-3 py-2">
                    {currentCase?.input}
                  </div>
                </div>

                {/* 🔥 EXPECTED OUTPUT */}
                <div>
                  <p className="text-slate-400 mb-1 font-bold">
                    Expected Output
                  </p>
                  <div className="bg-[#3a3a3a] rounded px-3 py-2 text-green-400">
                    {currentCase?.expected}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Result tabs */}
            <div className="flex items-center gap-1 mb-3">
              {allCases.map((c) => {
                const res = testResults.find((r) => r.caseId === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      selectedCase === c.id
                        ? "bg-slate-200 dark:bg-[#3a3a3a] text-slate-800 dark:text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#333]"
                    }`}
                  >
                    {res ? (
                      res.passed ? (
                        <CheckCircle size={11} className="text-[#2cbb5d]" />
                      ) : (
                        <XCircle size={11} className="text-red-500" />
                      )
                    ) : null}
                    {c.label}
                  </button>
                );
              })}
            </div>

            {caseResult ? (
              <div className="space-y-3 text-xs font-mono">
                <div
                  className={`flex items-center gap-2 font-semibold ${caseResult.passed ? "text-[#2cbb5d]" : "text-red-400"}`}
                >
                  {caseResult.passed ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {caseResult.passed ? "Accepted" : "Wrong Answer"}
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1 font-bold">
                    Input
                  </p>
                  <div className="bg-slate-100 dark:bg-[#282828] rounded px-3 py-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#3a3a3a]">
                    {/* {Object.entries(currentCase?.inputs || {}).map(([k, v]) => (
                      <div key={k}>{k} = {v}</div>
                    ))} */}
                    {caseResult.input}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1 font-bold">
                    Expected
                  </p>
                  <div className="bg-slate-100 dark:bg-[#282828] rounded px-3 py-2 text-[#2cbb5d] border border-slate-200 dark:border-[#3a3a3a]">
                    {/* {currentCase?.expected || "N/A"} */}
                    {caseResult.expected}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1 font-bold">
                    Actual
                  </p>
                  <div
                    className={`bg-slate-100 dark:bg-[#282828] rounded px-3 py-2 border border-slate-200 dark:border-[#3a3a3a] ${caseResult.passed ? "text-[#2cbb5d]" : "text-red-400"}`}
                  >
                    {caseResult.actual}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                Run your code to see results here.
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER: Only Console remains here */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#282828] border-t border-slate-200 dark:border-[#3a3a3a]">
        <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:text-slate-200 transition-all">
          <Terminal size={14} /> Console
        </button>
      </div>
    </div>
  );
}
