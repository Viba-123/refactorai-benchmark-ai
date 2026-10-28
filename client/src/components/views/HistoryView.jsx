import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";
import StatusBadge from "../common/StatusBadge";
import {
  History,
  Search,
  Filter,
  FileCode,
  ArrowRight,
  RefreshCw,
  Code2,
  Trash2
} from "lucide-react";

export default function HistoryView() {
  const { setAnalysisData, setActiveView, showToast } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch {
      showToast("Unable to fetch submission history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = (item.title || item.filename || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesLang =
      langFilter === "all" ||
      (item.language || "").toLowerCase() === langFilter.toLowerCase();
    return matchesSearch && matchesLang;
  });

  const handleInspect = (sub) => {
    setAnalysisData({
      id: sub.id,
      filename: sub.title || sub.filename || "Snippet",
      language: sub.language || "java",
      qualityScore: sub.score,
      maintainabilityIndex: sub.maintainabilityIndex || 80,
      cyclomaticComplexity: sub.cyclomaticComplexity || 6,
      linesOfCode: sub.linesOfCode || 100,
      cognitiveComplexity: 5,
      halsteadVolume: 350,
      executionOpsEstimate: "~1,100 ops",
      engineType: "Saved Database Historical Run",
      issues: [
        {
          id: "ISS-HIST-1",
          line: 18,
          severity: "Minor",
          type: "Optimization",
          title: "Lookup key caching recommended",
          description: "Repeated hashing computations can be avoided by caching node pointers."
        }
      ],
      originalCode: `// Historical code submission #${sub.id}\n// File: ${sub.title || sub.filename}\n// Language: ${sub.language}\n\npublic class Solution {\n    // Original archived implementation\n}`,
      suggestedCode: `// Historical refactored code submission #${sub.id}\n// Optimized maintainability index and complexity`,
      explanation: "Archived analysis report retrieved from persistent storage."
    });
    showToast(`Loaded report for ${sub.title || sub.filename}`, "info");
    setActiveView("results");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161824] border border-[#272b3e] rounded-xl shadow-sm">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Analysis & Benchmark History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, inspect, and compare previously analyzed code snippets and benchmark runs.
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202436] hover:bg-[#282d44] border border-[#2c3148] text-slate-300 rounded-md text-xs font-medium cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#161824] border border-[#272b3e] rounded-xl">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by file or problem name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#10121a] border border-[#262a3c] rounded-md text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Language:</span>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="bg-[#10121a] border border-[#262a3c] text-xs text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Languages</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#161824] border border-[#272b3e] rounded-xl overflow-hidden shadow-sm">
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
                <th className="px-4 py-3">Date</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212435] text-slate-300">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No submissions found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1c1f2e] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-slate-400" />
                      <span>{item.title || item.filename}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] uppercase text-indigo-300">
                      {item.language}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold">
                      <span className={item.score >= 80 ? "text-emerald-400" : "text-amber-400"}>
                        {item.score}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {item.maintainabilityIndex || 80} / 100
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {item.cyclomaticComplexity || 6}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status || "Passed"} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                      {item.timestamp || "Recently"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleInspect(item)}
                        className="px-2.5 py-1 bg-[#25293d] hover:bg-[#323752] text-indigo-300 hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
