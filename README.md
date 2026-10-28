# CodeQualityBenchmarker

> **Collaborative Code Quality Benchmarking Platform with AI-Powered Refactoring Advice**

A full-stack code quality analytics and benchmarking platform inspired by developer platforms like LeetCode. Features safe static analysis, AST decision-point complexity tracking, Halstead metrics, multi-version benchmark comparisons, team peer reviews, and transparent AI-assisted refactoring suggestions.

---

## Key Highlights & Architectural Features

- **Monaco Code Editor Canvas:** Full VS Code editing experience with multi-language syntax highlighting (Java, Python, JavaScript, TypeScript, C++), template problems, and local file upload.
- **Safe Static Analysis (Zero OS Execution):** Calculates McCabe Cyclomatic Complexity ($M = \text{decisions} + 1$), Maintainability Index (MI), Halstead Volume, and Cognitive Nesting Depth without executing user code on the host machine.
- **Transparent AI & Rule Engine Attribution:** Seamlessly integrates with Google Gemini / OpenAI when an API key is set (`GEMINI_API_KEY`), or falls back to an intelligent deterministic AST rule rewriter with clear provenance badges.
- **Multi-Version Benchmarking Studio:** Side-by-side performance and maintainability matrices comparing Baseline vs. Static Refactors vs. AI Optimized versions with Recharts bar and area visualizations.
- **Team Collaboration & Peer Review:** Threaded code review discussions tied to specific files and line numbers with status badges (`Reviewed`, `Approved`, `Needs Work`).
- **Resilient Dual Database Support:**
  - **Zero-Config Default:** Embedded H2 in PostgreSQL compatibility mode for instant one-click execution without external dependencies.
  - **Native PostgreSQL:** Switchable via `--spring.profiles.active=postgres`.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Monaco Editor (`@monaco-editor/react`), Recharts, Lucide Icons |
| **Backend** | Java 17/21/25, Spring Boot 3.3.5, Spring Data JPA, Hibernate, Bean Validation |
| **Persistence** | PostgreSQL (Production/Configured) + H2 Database (Zero-Config Development Fallback) |
| **Code Analysis** | Built-in Java AST Static Engine + Standalone Python AST Service (`python-analyzer/`) |
| **AI Advisor** | Google Gemini REST API / OpenAI API with deterministic rule-based fallback |

---

## Quickstart Guide

### Option 1: One-Click Full Stack Launcher (Windows)
Double-click `start-all.bat` in the project root, or execute from PowerShell:
```powershell
.\start-all.bat
```
This automatically launches:
1. Spring Boot Backend on `http://localhost:8080`
2. React Vite Frontend on `http://localhost:5173`

---

### Option 2: Running Services Individually

#### 1. Start the Spring Boot Backend (Port 8080)
```powershell
cd server
.\mvnw.cmd spring-boot:run
```
*Health Check Endpoint:* [`http://localhost:8080/api/health`](http://localhost:8080/api/health)  
*H2 Console (Interactive DB):* [`http://localhost:8080/h2-console`](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:codequality`, User: `sa`, Password: blank)

To run with your local PostgreSQL instance:
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=postgres
```

#### 2. Start the React Frontend (Port 5173)
```powershell
cd client
npm run dev
```
Open your browser and navigate to: [`http://localhost:5173`](http://localhost:5173)

#### 3. (Optional) Start the Python AST Microservice (Port 5001)
```powershell
cd python-analyzer
python analyzer_service.py 5001
```

---

## Core Feature Walkthrough

### 1. Dashboard
- Displays overall code quality score (0–100) on a radial gauge with color-coded grades (A+, A, B, C, D).
- Metrics for Total Submissions, Detected Issues, Maintainability Average, and McCabe Cyclomatic Complexity.
- Recharts area chart tracking score improvement across iterations.
- Table of recent code submissions with one-click report inspection.

### 2. Code Analyzer
- Interactive Monaco Editor with dark theme.
- Pre-loaded problem templates:
  - **LRUCache.java**: Cache eviction with concurrency vulnerabilities and missing boundary checks.
  - **transaction_processor.py**: High-complexity nested conditional validation ($M=19$).
  - **slidingWindowAggregator.js**: Inefficient $O(N \cdot W)$ nested loop pattern.
  - **graph_dijkstra.cpp**: Shortest path graph algorithm with potential integer overflow hazards.
- Language selector and local file upload reader.
- AI Refactoring toggle switch.

### 3. Analysis Results
- Multi-dimensional quality breakdown:
  - **Maintainability Index (MI):** $171 - 5.2 \ln(V) - 0.23 G - 16.2 \ln(\text{LOC})$
  - **Cyclomatic Complexity ($M$):** Decision branch density
  - **Halstead Volume:** Lexical vocabulary entropy
  - **Cognitive Complexity & Estimated Ops**
- Code smells and vulnerabilities list with line numbers, severity tags (Critical, Major, Minor, Info), and actionable remediation guidance.
- Filter issues by severity tabs.

### 4. Refactoring Advice Panel
- Side-by-side or tabbed Monaco comparison between original code and refactored code.
- Explicit provenance banner:
  - `[Google Gemini AI (API Key Configured)]` when `GEMINI_API_KEY` is provided.
  - `[Deterministic Rule-Based AST Engine]` when running in offline/deterministic mode.
- One-click "Copy Refactored" button.
- Detailed architectural explanation of changes.

### 5. Algorithmic Benchmarking Studio
- Multi-version matrix comparing Baseline, Static Refactor, and Optimized AI candidates.
- Interactive dual Recharts bar charts:
  - Runtime (ms) & Memory Footprint (MB)
  - Complexity vs. Maintainability Index
- "Simulate Run" test runner.
- "Add Version" modal to insert custom benchmark candidate runs.

### 6. Projects & Team Collaboration
- Create and organize repositories with language badges and repository links.
- Team member leaderboard with submission velocity and score averages.
- Line-referenced peer review discussion board with status tags (`Reviewed`, `Approved`, `Needs Work`).

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health probe reporting database type, version, and AI availability |
| `GET` | `/api/dashboard/metrics` | Aggregated statistics, score average, and recent submissions |
| `GET` | `/api/projects` | List all projects with submission counts and average quality scores |
| `POST` | `/api/projects` | Create a new project workspace |
| `POST` | `/api/analyze` | Execute static code analysis, calculate complexity metrics, and generate refactoring |
| `GET` | `/api/analysis/history` | List all saved submission records |
| `GET` | `/api/analysis/{id}` | Retrieve detailed analysis and issues report for a submission |
| `GET` | `/api/benchmark?projectId={id}` | Retrieve benchmark version comparison matrix |
| `POST` | `/api/benchmark/version` | Register a new benchmark candidate version |
| `GET` | `/api/collaboration/comments` | Retrieve peer review comment thread for a project |
| `POST` | `/api/collaboration/comments` | Post a line-level code review comment |
# refactorai-benchmark-ai  
