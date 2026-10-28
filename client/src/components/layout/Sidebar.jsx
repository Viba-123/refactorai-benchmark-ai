import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Code2,
  GitCompare,
  FolderKanban,
  Users,
  History,
  Terminal,
  Zap,
  Activity,
  FileCheck2,
  Sparkles
} from "lucide-react";

export default function Sidebar() {
  const { activeView, setActiveView } = useApp();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyzer", label: "Code Analyzer", icon: Code2, badge: "Monaco" },
    { id: "results", label: "Analysis Results", icon: FileCheck2 },
    { id: "refactor", label: "Refactoring Advice", icon: Sparkles, accent: true },
    { id: "benchmarks", label: "Benchmarking", icon: GitCompare },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "collaboration", label: "Team Collaboration", icon: Users },
    { id: "history", label: "History", icon: History }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#11131a] border-r border-[#222638] z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-[#222638] shrink-0 bg-[#13151e]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              CodeQuality
              <span className="text-indigo-400 font-extrabold text-[11px] px-1.5 py-0.2 rounded bg-indigo-950/70 border border-indigo-700/50">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">BENCHMARKER</span>
          </div>
        </div>

        {/* Engine status strip */}
        <div className="px-4 py-3 shrink-0">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#171a25] rounded-md border border-[#262a3d]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-[11px] text-slate-300 font-medium">AST Engine v2.4</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/90 text-white font-semibold shadow-sm shadow-indigo-700/40 border border-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#1a1c28]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.accent ? "text-violet-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? "bg-indigo-700 text-indigo-100" : "bg-[#232738] text-slate-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quota & Info Card */}
      <div className="p-3 border-t border-[#222638] bg-[#13151e] shrink-0">
        <div className="p-3 rounded-lg bg-[#181b27] border border-[#272b3d] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
              Static Scan Quota
            </span>
            <span className="text-xs font-mono font-semibold text-slate-200 mt-0.5">
              142 / 200 Runs
            </span>
            <div className="w-28 h-1.5 bg-[#252a3d] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-[71%] rounded-full"></div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>
    </aside>
  );
}
