import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../common/StatusBadge";
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Bot,
  Cpu,
  BookOpen,
  ArrowLeftRight,
  Columns,
  Maximize2
} from "lucide-react";

export default function RefactoringAdviceView() {
  const { analysisData, setActiveView, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [layoutMode, setLayoutMode] = useState("split"); // 'split' or 'tabs'
  const [activeTab, setActiveTab] = useState("suggested");

  if (!analysisData) {
    return (
      <div className="p-12 text-center bg-[#161824] border border-[#272b3e] rounded-xl">
        <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No Refactoring Advice Available</h3>
        <p className="text-xs text-slate-400 mt-1">
          Analyze code first to receive automated AST transformations and refactoring advice.
        </p>
        <button
          onClick={() => setActiveView("analyzer")}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Go to Code Analyzer
        </button>
      </div>
    );
  }

  const {
    filename = "Snippet",
    language = "java",
    originalCode = "",
    suggestedCode = "",
    explanation = "Refactoring applied to eliminate concurrency anti-patterns and improve cyclomatic boundaries.",
    isAiRefactored,
    engineType
  } = analysisData;

  const handleCopySuggested = () => {
    navigator.clipboard.writeText(suggestedCode);
    setCopied(true);
    showToast("Refactored code copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161824] border border-[#272b3e] rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-900/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Refactoring Advice: {filename}
              </h1>
              {isAiRefactored ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-950/70 border border-violet-700/60 text-[10px] font-mono text-violet-300 font-semibold">
                  <Bot className="w-3 h-3 text-violet-400" />
                  AI-Powered (Gemini / LLM)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-700/60 text-[10px] font-mono text-indigo-300 font-semibold">
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  Deterministic Rule-Based Engine
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: Higher maintainability, lower nesting complexity, and thread safety.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Layout Mode Toggle */}
          <button
            onClick={() => setLayoutMode(layoutMode === "split" ? "tabs" : "split")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202436] hover:bg-[#282d44] border border-[#2c3148] text-slate-300 rounded-md text-xs font-medium cursor-pointer"
            title="Toggle between Split View and Tabbed View"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="capitalize">{layoutMode === "split" ? "Tab View" : "Split View"}</span>
          </button>

          {/* Copy Suggested Code */}
          <button
            onClick={handleCopySuggested}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Refactored</span>
          </button>
        </div>
      </div>

      {/* Code Comparison Canvas */}
      {layoutMode === "split" ? (
        /* Side by Side Split View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Code */}
          <div className="bg-[#12141d] border border-[#262a3d] rounded-xl overflow-hidden flex flex-col h-[460px]">
            <div className="h-9 bg-[#171a26] border-b border-[#232738] px-4 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-rose-400 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Original Code (Baseline)
              </span>
              <span>Read-Only</span>
            </div>
            <div className="flex-1 w-full">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={originalCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: "on"
                }}
              />
            </div>
          </div>

          {/* Suggested Refactored Code */}
          <div className="bg-[#12141d] border border-violet-900/40 rounded-xl overflow-hidden flex flex-col h-[460px] shadow-lg shadow-violet-950/20">
            <div className="h-9 bg-[#1a1829] border-b border-violet-900/50 px-4 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-emerald-400 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Suggested Refactored Code
              </span>
              <span className="text-violet-300 text-[11px]">Optimized AST</span>
            </div>
            <div className="flex-1 w-full">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={suggestedCode}
                theme="vs-dark"
                options={{
                  readOnly: false,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', Consolas, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: "on"
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Tabbed View */
        <div className="bg-[#12141d] border border-[#262a3d] rounded-xl overflow-hidden flex flex-col h-[500px]">
          <div className="h-10 bg-[#161824] border-b border-[#232738] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("original")}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeTab === "original" ? "bg-rose-950/70 text-rose-300 border border-rose-800/50" : "text-slate-400 hover:text-white"
                }`}
              >
                Original Code (Baseline)
              </button>
              <button
                onClick={() => setActiveTab("suggested")}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeTab === "suggested" ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/50" : "text-slate-400 hover:text-white"
                }`}
              >
                Suggested Refactored Code
              </button>
            </div>
            <span className="text-xs font-mono text-slate-400">{language}</span>
          </div>
          <div className="flex-1 w-full">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={activeTab === "original" ? originalCode : suggestedCode}
              theme="vs-dark"
              options={{
                readOnly: activeTab === "original",
                fontSize: 12.5,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: "on"
              }}
            />
          </div>
        </div>
      )}

      {/* Explanation of Changes Card */}
      <div className="bg-[#161824] border border-[#272b3e] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white">
            Explanation of Architectural & Algorithmic Improvements
          </h2>
        </div>
        <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-[#11131c] p-4 rounded-lg border border-[#222638]">
          {explanation}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#222538]">
          <span>
            Provenance: {isAiRefactored ? "Generative AI model response verified" : "Rule-based structural AST rewriter"}
          </span>
          <button
            onClick={() => setActiveView("benchmarks")}
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Compare with other versions in Benchmarking</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
