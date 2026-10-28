import React from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

export default function NotificationToast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type = "info" } = toast;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "error":
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  const getBorder = () => {
    switch (type) {
      case "success":
        return "border-emerald-600/50 bg-[#121f1a]";
      case "error":
        return "border-rose-600/50 bg-[#211417]";
      case "warning":
        return "border-amber-600/50 bg-[#211d14]";
      default:
        return "border-indigo-600/50 bg-[#161829]";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl text-xs text-slate-200 max-w-md ${getBorder()}`}>
        {getIcon()}
        <span className="flex-1 font-medium">{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white text-base leading-none">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
