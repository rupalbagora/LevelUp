import { useRef, useEffect, useState } from "react";
import {
  animateEditorIn,
  animateCorrectSubmission,
} from "../../../utils/gsapAnimations";
import { STARTER_CODE, LANGUAGE_OPTIONS } from "../../../utils/battleHelpers";

export default function CodeEditor({
  language = "javascript",
  onLanguageChange,
  onChange,
  onMount,
  submissionStatus = null,
  username = "You",
}) {
  const wrapRef = useRef(null);
  const [codeMap, setCodeMap] = useState({
    javascript: STARTER_CODE.javascript,
    python: STARTER_CODE.python,
    java: STARTER_CODE.java,
  });
  const [EditorComponent, setEditorComponent] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const [typingStatus, setTypingStatus] = useState("Ready");

  const typingTimerRef = useRef(null);

  // language change----
 const code = codeMap[language];


  useEffect(() => {
    if (wrapRef.current) animateEditorIn(wrapRef.current);
  }, []);

  useEffect(() => {
    import("@monaco-editor/react").then((mod) => {
      setEditorComponent(() => mod.default);
      setEditorLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (submissionStatus === "correct" && wrapRef.current) {
      animateCorrectSubmission(wrapRef.current);
    }
  }, [submissionStatus]);

  function handleChange(value) {
    setTypingStatus("Typing...");

    clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      setTypingStatus("Ready");
    }, 1200);
setCodeMap((prev) => ({
  ...prev,
  [language]: value || "",
}));
    onChange?.(value || "");
  }

  return (
    <div ref={wrapRef} className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 h-10 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-blue-500 rounded-full shadow" />
          {username} (You)
          <span className="text-xs text-slate-400 ml-2 font-mono">
            {typingStatus}
          </span>
        </div>

        <select
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          className="bg-[#1e1e1e] border border-slate-700 text-xs px-2 py-[2px]"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        {editorLoaded && EditorComponent ? (
          <EditorComponent
            height="100%"
            language={language}
           value={code}
            theme="vs-dark"
            onChange={handleChange}
            onMount={(editor) => {
              onMount?.(editor);
              editor.focus();
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            Loading editor...
          </div>
        )}
      </div>
    </div>
  );
}
