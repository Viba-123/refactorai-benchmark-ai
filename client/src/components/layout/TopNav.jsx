import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Search, 
  Terminal, 
  FolderGit2, 
  ChevronDown, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  User
} from "lucide-react";

export default function TopNav() {
  const { 
    activeProject, 
    setActiveProject, 
    projects, 
    backendStatus, 
    searchQuery, 
    setSearchQuery,
    setActiveView,
    showToast
  } = useApp();

  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-[#14161f] border-b border-[#252838] z-40 flex items-center justify-between px-6">
      {/* Left: Project Selector and Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1b1e2c] border border-[#2c3046] rounded-md text-xs font-semibold text-slate-200 hover:bg-[#23273a] hover:border-[#3d4361] transition-colors"
            title="Switch Active Project"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate max-w-[140px]">{activeProject ? activeProject.name : "Select Project"}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-[#161824] border border-[#2c3046] rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-[#242738]">
                Projects ({projects.length})
              </div>
              <div className="max-h-56 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProject(p);
                      setProjectDropdownOpen(false);
                      showToast(`Switched active project to ${p.name}`, "info");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#212436] transition-colors ${
                      activeProject?.id === p.id ? "text-indigo-400 font-semibold bg-[#1e2235]" : "text-slate-300"
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#272b3f] text-slate-400">{p.language}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-[#242738] p-1.5">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    setActiveView("projects");
                  }}
                  className="w-full text-center py-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  + Manage / Create Projects
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, benchmarks, or smell rules (e.g. LRU Cache, AST)..."
            className="w-full pl-9 pr-12 py-1.5 bg-[#10121a] border border-[#25283a] rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 bg-[#1b1e2c] border border-[#2a2e44] rounded text-slate-400">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Engine Status, Notifications, and Profile */}
      <div className="flex items-center gap-3">
        {/* Backend / Runner Status Indicator */}
        <div 
          className="flex items-center gap-2 px-3 py-1 bg-[#10121a] border border-[#24283b] rounded-full text-xs cursor-pointer hover:border-[#383d58]"
          title={backendStatus.online ? "Spring Boot REST API Connected on Port 8080" : "Running on Local Deterministic Fallback Mode"}
          onClick={() => showToast(backendStatus.online ? "Backend Online: Spring Boot API + Persistence Active" : "Backend Offline: Running in-memory deterministic client analyzer", backendStatus.online ? "success" : "warning")}
        >
          <span className={`w-2 h-2 rounded-full ${backendStatus.online ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" : "bg-amber-400"}`}></span>
          <span className="font-mono text-[11px] font-medium text-slate-300">
            {backendStatus.online ? "RUNNER READY" : "OFFLINE ENGINE"}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {backendStatus.online ? "Spring 3.3 / PG" : "Local AST"}
          </span>
        </div>

        {/* AI Advisory status pill */}
        <div 
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-violet-950/40 border border-violet-800/50 rounded-full text-[11px] text-violet-300 cursor-pointer"
          onClick={() => showToast("AI Engine: Gemini/OpenAI integration ready when API key configured; deterministic fallback active.", "info")}
        >
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>RefactorAI</span>
        </div>

        <div className="h-5 w-px bg-[#252838]" />

        {/* Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-md hover:bg-[#1f2233] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold border border-indigo-400/30">
              AR
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">alex.dev</span>
              <span className="text-[10px] text-emerald-400 font-mono leading-tight">Rank #42 • 99.4%</span>
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#161824] border border-[#2c3046] rounded-md shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#25283a]">
                <p className="font-semibold text-slate-200">Alex Rivera</p>
                <p className="text-[11px] text-slate-400">alex.dev@codequality.local</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { setProfileDropdownOpen(false); setActiveView("dashboard"); }}
                  className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-[#202436] hover:text-white"
                >
                  My Submissions Overview
                </button>
                <button 
                  onClick={() => { setProfileDropdownOpen(false); setActiveView("collaboration"); }}
                  className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-[#202436] hover:text-white"
                >
                  Team Collaboration & Reviews
                </button>
                <button 
                  onClick={() => { setProfileDropdownOpen(false); setActiveView("projects"); }}
                  className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-[#202436] hover:text-white"
                >
                  Workspace Projects
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
