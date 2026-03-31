import { useRef, useEffect, useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import {
  animateEditorIn,
  animateCorrectSubmission,
} from "../../../utils/gsapAnimations";
import {
  STARTER_CODE,
  LANGUAGE_OPTIONS,
  MONACO_LANGUAGE_MAP,
} from "../../../utils/battleHelpers";

export default function CodeEditor({
  language = "python3",
  onLanguageChange,
  onChange,
  onMount,
  submissionStatus = null,
  username = "You",
}) {
  const wrapRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const monacoEditorRef = useRef(null);

  // Theme Detection logic
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme and observe changes
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  const [codeMap, setCodeMap] = useState(() =>
    Object.fromEntries(
      LANGUAGE_OPTIONS.map((opt) => [opt.value, STARTER_CODE[opt.value] || ""])
    )
  );

  const [EditorComponent, setEditorComponent] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [typingStatus, setTypingStatus] = useState("Saved");
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1 });
  const [resetState, setResetState] = useState(null);
  const resetTimerRef = useRef(null);

  const code = codeMap[language] || "";

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

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimerRef.current);
      clearTimeout(typingTimerRef.current);
      clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (value) => {
      const newVal = value || "";
      setCodeMap((prev) => ({ ...prev, [language]: newVal }));
      setTypingStatus("Typing...");
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setTypingStatus("Saved"), 1000);

      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        onChange?.(newVal);
      }, 500);
    },
    [language, onChange]
  );

  function handleEditorMount(editor) {
    monacoEditorRef.current = editor;
    onMount?.(editor);
    editor.focus();
    editor.onDidChangeCursorPosition((e) => {
      setCursorInfo({ line: e.position.lineNumber, col: e.position.column });
    });
  }

  function handleReset() {
    if (resetState !== "confirming") {
      setResetState("confirming");
      resetTimerRef.current = setTimeout(() => setResetState(null), 3000);
      return;
    }
    clearTimeout(resetTimerRef.current);
    setResetState(null);
    const defaultCode = STARTER_CODE[language] || "";
    setCodeMap((prev) => ({ ...prev, [language]: defaultCode }));
    onChange?.(defaultCode);
    setTypingStatus("Reset");
    if (monacoEditorRef.current) {
      monacoEditorRef.current.setValue(defaultCode);
    }
  }

  const monacoLang = MONACO_LANGUAGE_MAP[language] || language;

  return (
    <div ref={wrapRef} className="flex flex-col h-full bg-white dark:bg-[#1e1e1e]">
      {/* Toolbar - Dynamic Colors */}
      <div className="flex items-center justify-between px-3 h-10 bg-slate-50 dark:bg-[#252526] border-b border-slate-200 dark:border-[#333] flex-shrink-0 gap-2">
        {/* Left: user + typing status */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50 flex-shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 text-xs font-medium truncate">{username}</span>
          <span
            className={`text-[10px] font-mono ml-1 flex-shrink-0 ${
              typingStatus === "Typing..."
                ? "text-yellow-600 dark:text-yellow-400"
                : typingStatus === "Reset"
                ? "text-[#ffa116]"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {typingStatus}
          </span>
        </div>

        {/* Right: cursor info + reset + language */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden md:block">
            Ln {cursorInfo.line}, Col {cursorInfo.col}
          </span>

          <button
            onClick={handleReset}
            className={`flex items-center gap-1 px-2 py-[3px] rounded text-[10px] font-semibold border transition-all duration-200 ${
              resetState === "confirming"
                ? "border-red-500 text-red-500 bg-red-500/10 animate-pulse"
                : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent"
            }`}
          >
            <RotateCcw size={10} />
            {resetState === "confirming" ? "Confirm?" : "Reset"}
          </button>

          <select
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value)}
            className="bg-white dark:bg-[#1e1e1e] border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 px-2 py-[3px] rounded cursor-pointer outline-none"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden min-h-0">
        {editorLoaded && EditorComponent ? (
          <EditorComponent
            height="100%"
            language={monacoLang}
            value={code}
            // Yahan magic hai: vs-dark vs light switch
            theme={isDarkMode ? "vs-dark" : "light"}
            onChange={handleChange}
            onMount={handleEditorMount}
            options={{
              fontSize: 13,
              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "line",
              wordWrap: "on",
              tabSize: 4,
              automaticLayout: true,
              padding: { top: 8 },
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs">Loading editor...</span>
          </div>
        )}
      </div>
    </div>
  );
}