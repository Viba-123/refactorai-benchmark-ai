import React from "react";

export default function ScoreGauge({ score = 85, size = 120, label = "Quality Score" }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = () => {
    if (normalizedScore >= 80) return "#10b981"; // Emerald
    if (normalizedScore >= 60) return "#f59e0b"; // Amber
    return "#f43f5e"; // Rose
  };

  const getGrade = () => {
    if (normalizedScore >= 90) return "A+";
    if (normalizedScore >= 80) return "A";
    if (normalizedScore >= 70) return "B";
    if (normalizedScore >= 60) return "C";
    return "D";
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#25293d"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Inner Label */}
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold font-mono text-white tracking-tight">
          {normalizedScore}
        </span>
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
          Grade {getGrade()}
        </span>
      </div>
      {label && (
        <span className="text-xs font-medium text-slate-400 mt-1">
          {label}
        </span>
      )}
    </div>
  );
}
