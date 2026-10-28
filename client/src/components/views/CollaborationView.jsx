import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";
import { SAMPLE_TEAM_MEMBERS } from "../../services/sampleData";
import StatusBadge from "../common/StatusBadge";
import {
  Users,
  MessageSquare,
  Send,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  UserCheck,
  CornerDownRight
} from "lucide-react";

export default function CollaborationView() {
  const { activeProject, showToast } = useApp();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    targetFile: "LRUCache.java",
    line: 34,
    status: "Reviewed",
    comment: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await api.getComments(activeProject?.id || 1);
      setComments(data);
    } catch {
      showToast("Unable to fetch team comments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [activeProject]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentForm.comment.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await api.addComment({
        author: "Alex Rivera",
        role: "Lead Engineer",
        avatar: "AR",
        targetFile: commentForm.targetFile,
        line: Number(commentForm.line),
        comment: commentForm.comment.trim(),
        status: commentForm.status,
        projectId: activeProject?.id || 1
      });

      setComments([newComment, ...comments]);
      setCommentForm({ ...commentForm, comment: "" });
      showToast("Review comment posted to project thread!", "success");
    } catch (err) {
      showToast("Failed to post comment: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#161824] border border-[#272b3e] rounded-xl shadow-sm">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Team Collaboration & Peer Review
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Collaborative code quality reviews, line-by-line feedback, and architectural consensus.
          </p>
        </div>

        <span className="text-xs font-mono text-indigo-300 bg-indigo-950/70 border border-indigo-700/60 px-3 py-1 rounded-full shrink-0">
          Project: {activeProject ? activeProject.name : "Core"}
        </span>
      </div>

      {/* Main Grid: Team Members & Review Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Team Members */}
        <div className="bg-[#161824] border border-[#272b3e] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Project Members (4)
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Active</span>
          </div>

          <div className="divide-y divide-[#24283b]">
            {SAMPLE_TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{member.name}</p>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="text-slate-300 block">{member.submissions} runs</span>
                  <span className="text-emerald-400">{member.scoreAvg}% avg</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick guidelines */}
          <div className="p-3 bg-[#11131c] border border-[#222638] rounded-lg text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Code Review Checklist:</p>
            <p className="text-[11px]">• Complexity &lt; 10 McCabe points</p>
            <p className="text-[11px]">• Concurrency thread-safety confirmed</p>
            <p className="text-[11px]">• Zero unhandled exceptions</p>
          </div>
        </div>

        {/* Right 2 Cols: Comments Thread & Post Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Post Comment Box */}
          <div className="bg-[#161824] border border-[#272b3e] rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Add Submission Review Comment
            </h2>

            <form onSubmit={handleSubmitComment} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target File</label>
                  <input
                    type="text"
                    required
                    value={commentForm.targetFile}
                    onChange={(e) => setCommentForm({ ...commentForm, targetFile: e.target.value })}
                    className="w-full bg-[#10121a] border border-[#292e44] rounded-md px-3 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target Line #</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={commentForm.line}
                    onChange={(e) => setCommentForm({ ...commentForm, line: e.target.value })}
                    className="w-full bg-[#10121a] border border-[#292e44] rounded-md px-3 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Review Status</label>
                  <select
                    value={commentForm.status}
                    onChange={(e) => setCommentForm({ ...commentForm, status: e.target.value })}
                    className="w-full bg-[#10121a] border border-[#292e44] rounded-md px-3 py-1.5 text-white font-mono cursor-pointer focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Reviewed">Reviewed</option>
                    <option value="Approved">Approved</option>
                    <option value="Needs Work">Needs Work</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Comment & Feedback *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Share feedback on maintainability, lock contention, algorithmic time complexity..."
                  value={commentForm.comment}
                  onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                  className="w-full bg-[#10121a] border border-[#292e44] rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Posting..." : "Post Review"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="bg-[#161824] border border-[#272b3e] rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-[#24283b] flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
                Review Discussion History ({comments.length})
              </h3>
            </div>

            <div className="divide-y divide-[#222537]">
              {comments.map((c) => (
                <div key={c.id} className="p-4 hover:bg-[#191c2b] transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center text-white text-[10px] font-bold">
                        {c.avatar || "U"}
                      </div>
                      <span className="text-xs font-semibold text-white">{c.author}</span>
                      <span className="text-[10px] text-slate-400">({c.role})</span>
                      <span className="text-[10px] text-slate-500">• {c.timestamp || "Recent"}</span>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 pl-8">
                    <FileCode className="w-3 h-3" />
                    <span>{c.targetFile}</span>
                    <span>: line {c.line}</span>
                  </div>

                  <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
