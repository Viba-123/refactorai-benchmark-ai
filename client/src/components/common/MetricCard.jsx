import React from "react";

export default function MetricCard({ title, value, change, changeType = "positive", subtitle, icon: Icon, badge }) {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
    if (changeType === "negative") return "text-rose-400 bg-rose-950/40 border-rose-800/40";
    return "text-indigo-400 bg-indigo-950/40 border-indigo-800/40";
  };

  return (
    <div className="bg-[#161824] border border-[#262a3c] hover:border-[#383e58] p-4 rounded-xl transition-all shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-md bg-[#1f2233] border border-[#2b2f46] flex items-center justify-center text-slate-300">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="my-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {change && (
          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-mono font-medium ${getChangeColor()}`}>
            {change}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#232637] text-xs text-slate-400">
        <span>{subtitle || "Current cycle"}</span>
        {badge && (
          <span className="text-[10px] font-mono text-slate-500 bg-[#1c1f2e] px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
