import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import ScoreGauge from "../common/ScoreGauge";
import StatusBadge from "../common/StatusBadge";
import MetricCard from "../common/MetricCard";
import {
  FileCode,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GitBranch,
  Gauge,
  Layers,
  Terminal,
  Cpu,
  Info,
  SlidersHorizontal,
  RotateCcw
} from "lucide-react";

export default function AnalysisResultsView() {
  const { analysisData, setActiveView } = useApp();
  const [severityFilter, setSeverityFilter] = useState("all");

  if (!analysisData) {
    return (
      <div className="p-12 text-center bg-[#161824] border border-[#272b3e] rounded-xl">
        <FileCode className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No Analysis Results Yet</h3>
        <p className="text-xs text-slate-400 mt-1">
          Open the Code Analyzer, choose a language or paste your snippet, and click "Analyze Code".
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
    filename,
    language,
    qualityScore,
    maintainabilityIndex,
    cyclomaticComplexity,
    linesOfCode,
    cognitiveComplexity,
    halsteadVolume,
    executionOpsEstimate,
    engineType,
    issues = [],
    isDemo
  } = analysisData;

  const filteredIssues = issues.filter((iss) => {
    if (severityFilter === "all") return true;
    return (iss.severity || "").toLowerCase() === severityFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161824] border border-[#272b3e] rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">{filename}</h1>
              <span className="px-2 py-0.5 rounded bg-[#202436] border border-[#2e344d] text-[10px] font-mono uppercase text-indigo-300">
                {language}
              </span>
              {isDemo && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-300 font-mono">
                  Sample Data
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Engine: <span className="text-slate-300 font-mono">{engineType || "Deterministic Static AST Engine"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveView("analyzer")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202436] hover:bg-[#282d44] border border-[#2c3148] text-slate-300 rounded-md text-xs font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Analyze</span>
          </button>
          <button
            onClick={() => setActiveView("refactor")}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-md text-xs font-semibold shadow-md shadow-indigo-900/30 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Refactoring Advice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Score Gauge */}
        <div className="xl:col-span-1 bg-[#161824] border border-[#272b3e] p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
          <ScoreGauge score={qualityScore} size={110} label="Quality Health Score" />
          <span className="text-[11px] text-slate-400 mt-2 font-mono">
            {qualityScore >= 80 ? "Production Ready" : "Refactoring Needed"}
          </span>
        </div>

        {/* Metric Cards */}
        <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Maintainability Index"
            value={`${maintainabilityIndex}/100`}
            change={maintainabilityIndex >= 75 ? "Optimal" : "Degraded"}
            changeType={maintainabilityIndex >= 75 ? "positive" : "negative"}
            subtitle="Target MI &gt; 70"
            icon={Gauge}
            badge="Halstead Formula"
          />
          <MetricCard
            title="Cyclomatic Complexity"
            value={`${cyclomaticComplexity} M`}
            change={cyclomaticComplexity <= 10 ? "Low Risk" : "High Risk"}
            changeType={cyclomaticComplexity <= 10 ? "positive" : "negative"}
            subtitle="McCabe Decision Paths"
            icon={GitBranch}
            badge="Decision Points"
          />
          <MetricCard
            title="Lines of Code (LOC)"
            value={linesOfCode}
            change={`${cognitiveComplexity} Cognitive`}
            changeType="neutral"
            subtitle="Active executable statements"
            icon={Layers}
            badge="Volume"
          />
          <MetricCard
            title="Halstead Volume"
            value={halsteadVolume}
            change={executionOpsEstimate || "Est. Normal"}
            changeType="neutral"
            subtitle="Mental effort & entropy"
            icon={Cpu}
            badge="Lexical Info"
          />
        </div>
      </div>

      {/* Code Smells & Issues Detailed Panel */}
      <div className="bg-[#161824] border border-[#272b3e] rounded-xl overflow-hidden shadow-sm">
        {/* Header & Severity Filter Tabs */}
        <div className="px-5 py-4 border-b border-[#24283b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              Detected Issues & Code Smells ({filteredIssues.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identified anti-patterns, complexity hazards, and concurrency flaws
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["all", "critical", "major", "minor", "info"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono capitalize transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-[#202436] text-slate-400 hover:text-slate-200"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Cards List */}
        <div className="divide-y divide-[#222536]">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p>No issues detected matching filter "{severityFilter}".</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="p-4 hover:bg-[#1a1d2c] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-[#1e2235] border border-[#2b3047]">
                      Line {issue.line}
                    </span>
                    <StatusBadge status={issue.severity} />
                    <span className="text-xs font-semibold text-slate-200">
                      {issue.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-[#141620] px-2 py-0.5 rounded">
                    Type: {issue.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 pl-1 leading-relaxed">
                  {issue.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
