import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";
import StatusBadge from "../common/StatusBadge";
import MetricCard from "../common/MetricCard";
import {
  GitCompare,
  TrendingUp,
  Zap,
  Gauge,
  Clock,
  HardDrive,
  Layers,
  ShieldCheck,
  Play,
  Plus,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function BenchmarkingView() {
  const { activeProject, showToast } = useApp();
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [newVersionForm, setNewVersionForm] = useState({
    version: "v2.1 (Custom)",
    cyclomaticComplexity: 5,
    maintainabilityIndex: 92,
    linesOfCode: 95,
    estimatedRuntimeMs: 12.5,
    memoryFootprintMb: 19.8,
    codeSmells: 0
  });

  const loadBenchmarks = async () => {
    setLoading(true);
    try {
      const data = await api.getBenchmarks(activeProject?.id || 1);
      setBenchmarks(data);
    } catch {
      showToast("Unable to load benchmarks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenchmarks();
  }, [activeProject]);

  const handleRunSimulation = () => {
    setSimulating(true);
    showToast("Executing safe algorithmic benchmarking simulation...", "info");
    setTimeout(() => {
      setSimulating(false);
      showToast("Benchmarking simulation finished: 0 anomalies detected.", "success");
    }, 1500);
  };

  const handleAddVersion = (e) => {
    e.preventDefault();
    const created = {
      version: newVersionForm.version,
      language: activeProject?.language || "Java",
      author: "Alex Rivera",
      cyclomaticComplexity: Number(newVersionForm.cyclomaticComplexity),
      maintainabilityIndex: Number(newVersionForm.maintainabilityIndex),
      linesOfCode: Number(newVersionForm.linesOfCode),
      estimatedRuntimeMs: Number(newVersionForm.estimatedRuntimeMs),
      memoryFootprintMb: Number(newVersionForm.memoryFootprintMb),
      codeSmells: Number(newVersionForm.codeSmells),
      qualityScore: Math.round(
        100 - (Number(newVersionForm.cyclomaticComplexity) * 2) - (Number(newVersionForm.codeSmells) * 3)
      ),
      isCurrent: true
    };

    setBenchmarks([...benchmarks.map(b => ({ ...b, isCurrent: false })), created]);
    setNewVersionModalOpen(false);
    showToast(`Added ${created.version} to benchmark matrix!`, "success");
  };

  // Prepare chart comparison data
  const chartData = benchmarks.map((b) => ({
    name: b.version,
    "Runtime (ms)": b.estimatedRuntimeMs,
    "Memory (MB)": b.memoryFootprintMb,
    "Complexity (M)": b.cyclomaticComplexity,
    "Maintainability": b.maintainabilityIndex
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161824] border border-[#272b3e] rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-400" />
              Algorithmic Benchmarking Studio
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/60 text-indigo-300">
              {activeProject ? activeProject.name : "Core Suite"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Compare multi-iteration performance, cyclomatic complexity reduction, memory overhead, and maintainability index across versions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setNewVersionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202436] hover:bg-[#282d44] border border-[#2c3148] text-slate-200 rounded-md text-xs font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Version</span>
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white rounded-md text-xs font-semibold shadow-md shadow-indigo-900/40 cursor-pointer"
          >
            {simulating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparative Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runtime & Memory Chart */}
        <div className="bg-[#161824] border border-[#272b3e] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                Runtime & Memory Footprint
              </h2>
              <p className="text-xs text-slate-400">Lower values indicate faster and leaner execution</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              61.5% Faster
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#25293d" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171a26",
                    borderColor: "#333850",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                    fontSize: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="Runtime (ms)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Memory (MB)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complexity vs Maintainability Chart */}
        <div className="bg-[#161824] border border-[#272b3e] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                Complexity vs. Maintainability
              </h2>
              <p className="text-xs text-slate-400">Cyclomatic vs Halstead Maintainability Index</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
              +31 pts MI
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#25293d" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171a26",
                    borderColor: "#333850",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                    fontSize: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="Maintainability" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Complexity (M)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Benchmark Matrix Data Table */}
      <div className="bg-[#161824] border border-[#272b3e] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#24283b] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            Version Comparison Matrix
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {benchmarks.length} candidate versions registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12141c] text-slate-400 border-b border-[#232738] font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3">Version</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Maintainability</th>
                <th className="px-4 py-3">Cyclomatic (M)</th>
                <th className="px-4 py-3">Runtime</th>
                <th className="px-4 py-3">Memory</th>
                <th className="px-4 py-3">Code Smells</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#212435] text-slate-300">
              {benchmarks.map((b, idx) => (
                <tr key={idx} className={`hover:bg-[#1c1f2e] transition-colors ${b.isCurrent ? "bg-[#181d2f]/50" : ""}`}>
                  <td className="px-5 py-3.5 font-medium text-white flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{b.version}</span>
                    {b.isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 font-sans">
                    {b.author}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold">
                    <span className={b.qualityScore >= 80 ? "text-emerald-400" : "text-amber-400"}>
                      {b.qualityScore}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {b.maintainabilityIndex} / 100
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {b.cyclomaticComplexity}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {b.estimatedRuntimeMs} ms
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {b.memoryFootprintMb} MB
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300">
                    {b.codeSmells} smells
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <StatusBadge status={b.qualityScore >= 85 ? "Optimal" : b.qualityScore >= 70 ? "Stable" : "Suboptimal"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Version Modal */}
      {newVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#161824] border border-[#2b3044] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#24283b] pb-3">
              <h3 className="text-sm font-bold text-white">Add Benchmark Version</h3>
              <button
                onClick={() => setNewVersionModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddVersion} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Version Label</label>
                <input
                  type="text"
                  required
                  value={newVersionForm.version}
                  onChange={(e) => setNewVersionForm({ ...newVersionForm, version: e.target.value })}
                  className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Complexity (M)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newVersionForm.cyclomaticComplexity}
                    onChange={(e) => setNewVersionForm({ ...newVersionForm, cyclomaticComplexity: e.target.value })}
                    className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Maintainability (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newVersionForm.maintainabilityIndex}
                    onChange={(e) => setNewVersionForm({ ...newVersionForm, maintainabilityIndex: e.target.value })}
                    className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Runtime (ms)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newVersionForm.estimatedRuntimeMs}
                    onChange={(e) => setNewVersionForm({ ...newVersionForm, estimatedRuntimeMs: e.target.value })}
                    className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Memory (MB)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newVersionForm.memoryFootprintMb}
                    onChange={(e) => setNewVersionForm({ ...newVersionForm, memoryFootprintMb: e.target.value })}
                    className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#24283b]">
                <button
                  type="button"
                  onClick={() => setNewVersionModalOpen(false)}
                  className="px-3 py-1.5 bg-[#202436] hover:bg-[#282d44] text-slate-300 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md shadow-md cursor-pointer"
                >
                  Save Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
