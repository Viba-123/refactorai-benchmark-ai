import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";
import {
  Play,
  Upload,
  Copy,
  RotateCcw,
  Sparkles,
  FileCode,
  Check,
  AlertTriangle,
  Layers,
  HelpCircle,
  FileText
} from "lucide-react";

// Pre-packaged code snippet templates for quick testing
const CODE_TEMPLATES = {
  java: {
    filename: "LRUCache.java",
    code: `public class LRUCache {
    private int capacity;
    private java.util.Map<Integer, Node> map;
    private Node head, tail;

    static class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        map = new java.util.HashMap<>();
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    // Bug & Smell: Lack of concurrency protection & nested mutations
    public int get(int key) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            remove(node);
            insert(node);
            return node.value;
        }
        return -1;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        if (map.size() == capacity) {
            remove(tail.prev);
        }
        insert(new Node(key, value));
    }

    private void remove(Node node) {
        map.remove(node.key);
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insert(Node node) {
        map.put(node.key, node);
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
}`
  },
  python: {
    filename: "transaction_processor.py",
    code: `def process_transactions(transactions, account_limits):
    """
    High complexity transaction batch validator with nested conditionals.
    """
    processed = []
    failed = []
    
    for tx in transactions:
        if tx is not None:
            if 'amount' in tx and tx['amount'] > 0:
                user = tx.get('user_id')
                if user in account_limits:
                    limit = account_limits[user]
                    if tx['amount'] <= limit:
                        if tx.get('status') == 'PENDING':
                            # Nested state updates
                            account_limits[user] -= tx['amount']
                            processed.append(tx['id'])
                        else:
                            failed.append({'id': tx['id'], 'reason': 'Invalid state'})
                    else:
                        failed.append({'id': tx['id'], 'reason': 'Limit exceeded'})
                else:
                    failed.append({'id': tx['id'], 'reason': 'User not found'})
            else:
                failed.append({'id': tx.get('id'), 'reason': 'Invalid amount'})
        else:
            continue
            
    return {'processed': processed, 'failed': failed, 'remaining': account_limits}
`
  },
  javascript: {
    filename: "slidingWindowAggregator.js",
    code: `// Window-based metric aggregator
function calculateRollingAverages(datapoints, windowSize) {
    if (!datapoints || datapoints.length === 0 || windowSize <= 0) {
        return [];
    }

    let results = [];
    for (let i = 0; i < datapoints.length; i++) {
        let sum = 0;
        let count = 0;
        // Inefficient O(N * W) nested loop smell
        for (let j = Math.max(0, i - windowSize + 1); j <= i; j++) {
            sum += datapoints[j];
            count++;
        }
        results.push(sum / count);
    }
    return results;
}
`
  },
  cpp: {
    filename: "graph_dijkstra.cpp",
    code: `#include <vector>
#include <queue>
#include <climits>

using namespace std;

// Shortest path with potential integer overflow smell
vector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(V, INT_MAX);

    dist[S] = 0;
    pq.push({0, S});

    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            // Potential overflow risk if dist[u] + weight exceeds INT_MAX
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
`
  }
};

export default function CodeAnalyzerView() {
  const { setActiveView, setAnalysisData, showToast, activeProject } = useApp();
  const [language, setLanguage] = useState("java");
  const [filename, setFilename] = useState("LRUCache.java");
  const [code, setCode] = useState(CODE_TEMPLATES.java.code);
  const [analyzing, setAnalyzing] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (CODE_TEMPLATES[newLang]) {
      setCode(CODE_TEMPLATES[newLang].code);
      setFilename(CODE_TEMPLATES[newLang].filename);
    }
    setValidationError("");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setCode(content);
        setFilename(file.name);
        // Auto-detect language
        if (file.name.endsWith(".py")) setLanguage("python");
        else if (file.name.endsWith(".js") || file.name.endsWith(".jsx")) setLanguage("javascript");
        else if (file.name.endsWith(".ts") || file.name.endsWith(".tsx")) setLanguage("javascript");
        else if (file.name.endsWith(".cpp") || file.name.endsWith(".h")) setLanguage("cpp");
        else if (file.name.endsWith(".java")) setLanguage("java");
        showToast(`Loaded ${file.name} (${Math.round(file.size / 1024)} KB)`, "info");
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!code || code.trim().length === 0) {
      setValidationError("Please paste or write some code before initiating analysis.");
      return;
    }
    setValidationError("");
    setAnalyzing(true);

    try {
      showToast("Starting safe static analysis & AST parsing...", "info");
      const result = await api.analyzeCode({
        code,
        language,
        filename,
        projectId: activeProject?.id || 1,
        runAiAdvisor: useAi
      });

      setAnalysisData(result);
      showToast(`Analysis complete! Score: ${result.qualityScore}/100`, "success");
      // Transition to results view
      setActiveView("results");
    } catch (err) {
      showToast("Analysis failed: " + err.message, "error");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#161824] border border-[#272b3e] rounded-xl shadow-sm">
        {/* Language selector & File Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase text-slate-400">Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-[#10121a] border border-[#292e44] text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
            >
              <option value="java">Java (JDK 17/21)</option>
              <option value="python">Python 3.x</option>
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="cpp">C++ 20</option>
            </select>
          </div>

          <div className="h-4 w-px bg-[#262a3e] hidden sm:block" />

          {/* Filename input */}
          <div className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Filename.ext"
              className="bg-[#10121a] border border-[#292e44] text-slate-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500 font-mono w-48"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Refactor Toggle */}
          <button
            onClick={() => setUseAi(!useAi)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              useAi
                ? "bg-violet-950/70 border-violet-600 text-violet-200 shadow-sm shadow-violet-900/30"
                : "bg-[#1a1d2c] border-[#2b3046] text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle Generative AI Refactoring (Gemini / OpenAI API if configured, otherwise deterministic engine)"
          >
            <Sparkles className={`w-3.5 h-3.5 ${useAi ? "text-violet-400" : "text-slate-400"}`} />
            <span>AI Advice {useAi ? "ON" : "OFF"}</span>
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".java,.py,.js,.ts,.tsx,.jsx,.cpp,.c,.h"
          />

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f2233] hover:bg-[#282d44] border border-[#2c3148] text-slate-300 rounded-md text-xs font-medium transition-colors cursor-pointer"
            title="Upload source code file from disk"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 bg-[#1f2233] hover:bg-[#282d44] border border-[#2c3148] text-slate-300 rounded-md text-xs transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Reset Template Button */}
          <button
            onClick={() => handleLanguageChange(language)}
            className="p-1.5 bg-[#1f2233] hover:bg-[#282d44] border border-[#2c3148] text-slate-300 rounded-md text-xs transition-colors cursor-pointer"
            title="Reset to problem template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Main Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-semibold rounded-md text-xs shadow-md shadow-indigo-900/40 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning AST...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Analyze Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800/60 rounded-lg text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Monaco Code Editor Canvas */}
      <div className="bg-[#12141d] border border-[#262a3d] rounded-xl overflow-hidden shadow-inner flex flex-col h-[520px]">
        {/* Top editor breadcrumb bar */}
        <div className="h-8 bg-[#161824] border-b border-[#232738] px-4 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-300 font-semibold">{filename}</span>
            <span className="text-[10px] text-slate-400">({language})</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Safe Sandbox: Static Scan Only</span>
            <span>UTF-8</span>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 w-full relative">
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              lineNumbers: "on",
              renderLineHighlight: "all",
              cursorBlinking: "smooth",
              padding: { top: 12, bottom: 12 }
            }}
          />
        </div>
      </div>

      {/* Safety & Educational Footnote */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#141622] border border-[#232637] rounded-lg text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            Safe Static Analysis Guarantee: Code is evaluated syntactically through AST and metric heuristics. Zero hostile OS execution.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          McCabe Complexity • Halstead Metrics • Clean Architecture
        </span>
      </div>
    </div>
  );
}
