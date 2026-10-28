import React from "react";

export default function StatusBadge({ status, type }) {
  const getStyle = () => {
    const text = (status || "").toLowerCase();
    if (text.includes("pass") || text.includes("optimal") || text.includes("approved")) {
      return "bg-emerald-950/60 text-emerald-400 border-emerald-800/60";
    }
    if (text.includes("need") || text.includes("major") || text.includes("critical") || text.includes("smell")) {
      return "bg-rose-950/60 text-rose-400 border-rose-800/60";
    }
    if (text.includes("minor") || text.includes("warning") || text.includes("review")) {
      return "bg-amber-950/60 text-amber-400 border-amber-800/60";
    }
    if (text.includes("ai") || text.includes("gemini") || text.includes("openai")) {
      return "bg-violet-950/70 text-violet-300 border-violet-700/60";
    }
    return "bg-slate-800/80 text-slate-300 border-slate-700";
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono border font-medium ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      <span>{status}</span>
    </span>
  );
}
