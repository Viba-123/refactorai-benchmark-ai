import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";
import {
  FolderKanban,
  Plus,
  GitBranch,
  Star,
  ExternalLink,
  Code2,
  Calendar,
  CheckCircle2,
  Info
} from "lucide-react";

export default function ProjectsView() {
  const { projects, setProjects, activeProject, setActiveProject, setActiveView, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    language: "Java",
    repoUrl: ""
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    try {
      const created = await api.createProject({
        name: form.name.trim(),
        description: form.description.trim(),
        language: form.language,
        repoUrl: form.repoUrl.trim()
      });

      setProjects([created, ...projects]);
      setActiveProject(created);
      setModalOpen(false);
      setForm({ name: "", description: "", language: "Java", repoUrl: "" });
      showToast(`Project "${created.name}" created and set as active!`, "success");
    } catch (err) {
      showToast("Error creating project: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161824] border border-[#272b3e] rounded-xl shadow-sm">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            Project Workspaces
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize codebases, track quality benchmarks per repository, and coordinate team reviews.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-900/40 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isActive = activeProject?.id === proj.id;
          return (
            <div
              key={proj.id}
              className={`bg-[#161824] border rounded-xl p-5 flex flex-col justify-between transition-all shadow-sm ${
                isActive
                  ? "border-indigo-500/80 ring-1 ring-indigo-500/30"
                  : "border-[#262a3d] hover:border-[#383e58]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                    <h2 className="text-sm font-bold text-white tracking-tight">{proj.name}</h2>
                  </div>
                  {isActive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono border border-indigo-700/60 font-semibold">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {proj.description || "No description provided."}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#23273a] space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proj.language}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>Avg Score:</span>
                    <span className="font-bold text-white">
                      {proj.avgScore ? Math.round(proj.avgScore) : 82}/100
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {proj.repoUrl ? (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-mono truncate max-w-[150px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Repository</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Local Workspace</span>
                  )}

                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => {
                          setActiveProject(proj);
                          showToast(`Set active project to ${proj.name}`, "info");
                        }}
                        className="px-2.5 py-1 bg-[#202436] hover:bg-[#282d44] text-slate-300 rounded text-xs font-medium cursor-pointer"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setActiveView("analyzer");
                      }}
                      className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Analyze
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#161824] border border-[#2b3044] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#24283b] pb-3">
              <h3 className="text-sm font-bold text-white">Create New Project</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed-Raft-Consensus"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white font-mono cursor-pointer"
                >
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="C++">C++</option>
                  <option value="Go">Go</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief architectural overview or benchmark objective..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Repository URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo"
                  value={form.repoUrl}
                  onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                  className="w-full bg-[#10121a] border border-[#2a2e42] rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#24283b]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-[#202436] hover:bg-[#282d44] text-slate-300 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
