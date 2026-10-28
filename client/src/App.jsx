import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import TopNav from "./components/layout/TopNav";
import NotificationToast from "./components/common/NotificationToast";

// Views
import DashboardView from "./components/views/DashboardView";
import CodeAnalyzerView from "./components/views/CodeAnalyzerView";
import AnalysisResultsView from "./components/views/AnalysisResultsView";
import RefactoringAdviceView from "./components/views/RefactoringAdviceView";
import BenchmarkingView from "./components/views/BenchmarkingView";
import ProjectsView from "./components/views/ProjectsView";
import CollaborationView from "./components/views/CollaborationView";
import HistoryView from "./components/views/HistoryView";

function MainAppShell() {
  const { activeView, toast } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "analyzer":
        return <CodeAnalyzerView />;
      case "results":
        return <AnalysisResultsView />;
      case "refactor":
        return <RefactoringAdviceView />;
      case "benchmarks":
        return <BenchmarkingView />;
      case "projects":
        return <ProjectsView />;
      case "collaboration":
        return <CollaborationView />;
      case "history":
        return <HistoryView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col flex-1 min-h-screen">
        {/* Top Header Bar */}
        <TopNav />

        {/* View Router Main Viewport */}
        <main className="w-full pt-20 px-8 pb-12 flex-1 max-w-[1600px] mx-auto animate-in fade-in duration-200">
          {renderActiveView()}
        </main>
      </div>

      {/* Alert / Notification Toast */}
      <NotificationToast toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
