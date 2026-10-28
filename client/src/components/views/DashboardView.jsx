import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";
import MetricCard from "../common/MetricCard";
import ScoreGauge from "../common/ScoreGauge";
import StatusBadge from "../common/StatusBadge";
import {
  Send,
  ShieldAlert,
  GitBranch,
  Gauge,
  ArrowRight,
  Code2,
  Sparkles,
  RefreshCw,
  Info,
  Clock,
  Layers,
  ChevronRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function DashboardView() {
  const { setActiveView, setAnalysisData, showToast, activeProject } = useApp();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch {
      showToast("Unable to load latest dashboard metrics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeProject]);

  // Chart data for trend over recent sprints
  const trendData = [
    { run: "Run 1", score: 68, complexity: 16 },
    { run: "Run 2", score: 72, complexity: 14 },
    { run: "Run 3", score: 71, complexity: 14 },
    { run: "Run 4", score: 78, complexity: 11 },
    { run: "Run 5", score: 82, complexity: 9 },
    { run: "Run 6", score: 85, complexity: 7 },
    { run: "Run 7", score: 89, complexity: 6 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Notification Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171a27] via-[#1c2032] to-[#171a27] border border-[#2b3047] p-6 shadow-lg">
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-[11px] font-mono text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Engine Ready • Safe Static Mode Active
              </span>
              {metrics?.isDemo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/50 text-[10px] font-mono text-amber-300">
                  <Info className="w-3 h-3" />
                  Showing Benchmark Seed Data
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Code Quality & Refactoring Workspace
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time AST complexity scanning, Halstead metrics, and AI-assisted refactoring recommendations for multi-language codebases.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView("analyzer")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-900/40 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Analyze New Code</span>
            </button>
            <button
              onClick={() => setActiveView("benchmarks")}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#202436] hover:bg-[#282d44] text-slate-200 border border-[#2e344d] rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-violet-400" />
              <span>Compare Versions</span>
            </button>
            <button
              onClick={fetchDashboardData}
              title="Refresh Metrics"
              className="p-2 bg-[#202436] hover:bg-[#282d44] text-slate-400 hover:text-white border border-[#2e344d] rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid (4 Cards + Gauge Spotlight) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Quality Score Spotlight */}
        <div className="xl:col-span-1 bg-[#161824] border border-[#282d42] p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
          <ScoreGauge score={metrics ? metrics.overallQualityScore : 84} size={110} label="Quality Health Score" />
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Target &gt; 80 (Grade A)
          </p>
        </div>

        {/* 4 Standard Metrics */}
        <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Analyzed Submissions"
            value={metrics ? metrics.totalSubmissions : "93"}
            change="+14 this week"
            changeType="positive"
            subtitle="Across all repositories"
            icon={Send}
            badge="AST Verified"
          />
          <MetricCard
            title="Issues Detected"
            value={metrics ? metrics.issuesDetected : "24"}
            change="-8 fixed"
            changeType="positive"
            subtitle="Critical & major smells"
            icon={ShieldAlert}
            badge="Static Scan"
          />
          <MetricCard
            title="Avg Maintainability"
            value={metrics ? `${metrics.avgMaintainability}/100` : "79.1"}
            change="+6.2% improvement"
            changeType="positive"
            subtitle="Target MI &gt; 75"
            icon={Gauge}
            badge="Halstead Formula"
          />
          <MetricCard
            title="Cyclomatic Complexity"
            value={metrics ? `${metrics.cyclomaticAvg} M` : "8.4 M"}
            change="Linear threshold"
            changeType="neutral"
            subtitle="Avg decision branch depth"
            icon={GitBranch}
            badge="McCabe Index"
          />
        </div>
      </div>

      {/* Main Content Split: Chart & Issues Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quality Trend Chart */}
        <div className="lg:col-span-2 bg-[#161824] border border-[#272b3e] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Code Quality Trend Over Iterations
              </h2>
              <p className="text-xs text-slate-400">
                Score vs. Cyclomatic Complexity across successive submissions
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-[#1d2030] px-2 py-1 rounded border border-[#2c3148]">
              Sprint 4 Telemetry
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="complexityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#25293d" vertical={false} />
                <XAxis dataKey="run" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171a26",
                    borderColor: "#333850",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                    fontSize: "12px"
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" name="Quality Score" />
                <Area type="monotone" dataKey="complexity" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#complexityGrad)" name="Cyclomatic (M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-[#23273a] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-indigo-500"></span>
              <span className="text-slate-300">Quality Score (Higher is better)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
              <span className="text-slate-300">Cyclomatic Complexity (Lower is better)</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Severity Breakdown & AI Recommendations */}
        <div className="bg-[#161824] border border-[#272b3e] rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Detected Smells Breakdown</span>
              <span className="text-[11px] font-mono text-slate-400">Total: 24</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Categorized by severity and architectural impact
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400 font-medium">Critical (Concurrency & Leaks)</span>
                <span className="font-mono text-slate-300">2 (8%)</span>
              </div>
              <div className="w-full h-2 bg-[#202436] rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full w-[8%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400 font-medium">Major (High Complexity &gt; 15)</span>
                <span className="font-mono text-slate-300">6 (25%)</span>
              </div>
              <div className="w-full h-2 bg-[#202436] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[25%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-400 font-medium">Minor (Dead Code & Style)</span>
                <span className="font-mono text-slate-300">11 (46%)</span>
              </div>
              <div className="w-full h-2 bg-[#202436] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[46%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Info (Documentation & Type Hints)</span>
                <span className="font-mono text-slate-300">5 (21%)</span>
              </div>
              <div className="w-full h-2 bg-[#202436] rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full w-[21%]"></div>
              </div>
            </div>
          </div>

          {/* Quick AI Refactor Spotlight */}
          <div className="p-3.5 rounded-lg bg-gradient-to-br from-indigo-950/40 to-violet-950/30 border border-indigo-800/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-indigo-200 block">
                Automated Advice Available
              </span>
              <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                LRUCache.java has 3 actionable refactor recommendations reducing lock contention.
              </span>
              <button
                onClick={() => setActiveView("refactor")}
                className="mt-2 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Refactoring Diff</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions Activity Table */}
      <div className="bg-[#161824] border border-[#272b3e] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#24283b] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Code Submissions
            </h2>
            <p className="text-xs text-slate-400">
              Latest analyzed snippets with score, complexity, and inspection shortcuts
            </p>
          </div>
          <button
            onClick={() => setActiveView("history")}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12141c] text-slate-400 border-b border-[#232738] font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3">File / Problem</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Maintainability</th>
                <th className="px-4 py-3">Complexity (M)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212435] text-slate-300">
              {(metrics?.recentSubmissions || []).map((sub) => (
                <tr key={sub.id} className="hover:bg-[#1c1f2e] transition-colors">
                  <td className="px-5 py-3.5 font-medium text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span>{sub.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({sub.projectName})</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] uppercase text-indigo-300">
                    {sub.language}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-white">
                    <span className={sub.score >= 80 ? "text-emerald-400" : sub.score >= 65 ? "text-amber-400" : "text-rose-400"}>
                      {sub.score}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {sub.maintainabilityIndex} / 100
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {sub.cyclomaticComplexity}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                    {sub.timestamp}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        setAnalysisData({
                          ...sub,
                          filename: sub.title,
                          qualityScore: sub.score,
                          issues: [
                            {
                              id: "ISS-1",
                              line: 12,
                              severity: "Major",
                              type: "Refactoring Opportunity",
                              title: "High cyclomatic complexity branch detected",
                              description: "Multiple chained if/else conditions can be replaced with a lookup map."
                            }
                          ],
                          originalCode: `// ${sub.title}\n// Language: ${sub.language}\n\npublic class Solution {\n    // Code snippet for ${sub.title}\n}`,
                          suggestedCode: `// Optimized solution for ${sub.title}\n// Reduced cyclomatic complexity and enhanced maintainability index`,
                          explanation: "Structural static analysis suggests extracting helper methods and optimizing loops."
                        });
                        setActiveView("results");
                      }}
                      className="px-2.5 py-1 bg-[#25293d] hover:bg-[#323752] text-indigo-300 hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
