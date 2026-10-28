import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { SAMPLE_PROJECTS, SAMPLE_ANALYSIS_DETAIL } from "../services/sampleData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeView, setActiveView] = useState("dashboard");
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [activeProject, setActiveProject] = useState(SAMPLE_PROJECTS[0]);
  const [analysisData, setAnalysisData] = useState(SAMPLE_ANALYSIS_DETAIL);
  const [backendStatus, setBackendStatus] = useState({ online: false, checked: false, engine: "LLVM AST Static" });
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const checkStatus = async () => {
    const status = await api.checkHealth();
    setBackendStatus({
      online: status.online,
      checked: true,
      engine: status.engine || "LLVM AST Engine v2.4",
      database: status.database || "PostgreSQL",
      aiAvailable: status.aiAvailable || false
    });
  };

  const loadProjects = async () => {
    const data = await api.getProjects();
    setProjects(data);
    if (data.length > 0 && !activeProject) {
      setActiveProject(data[0]);
    }
  };

  useEffect(() => {
    checkStatus();
    loadProjects();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        projects,
        setProjects,
        activeProject,
        setActiveProject,
        analysisData,
        setAnalysisData,
        backendStatus,
        checkStatus,
        toast,
        showToast,
        searchQuery,
        setSearchQuery,
        loadProjects
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
