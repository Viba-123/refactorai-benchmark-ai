# app.py
"""Main FastAPI application entry point for RefactorAI.
Includes authentication, analysis APIs, and static HTML routes.
"""

from pathlib import Path
import sqlite3
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager

# Paths
BASE_DIR = Path(__file__).parent
WORKSPACE_FILE = BASE_DIR / "workspace.html"
LOGIN_FILE = BASE_DIR / "login.html"
DASHBOARD_FILE = BASE_DIR / "dashboard.html"
DB_PATH = BASE_DIR / "refactorai.db"

# Routers
from auth import router as auth_router
from analysis import router as analysis_router

def init_db() -> None:
    """Initialize the SQLite database with required tables."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS benchmark_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            language TEXT,
            runtime_ms INTEGER,
            memory_mb REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            pwd_hash TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            language TEXT NOT NULL,
            score REAL NOT NULL DEFAULT 0.0,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    conn.commit()
    conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("✅ Database ready.")
    yield

app = FastAPI(title="RefactorAI", lifespan=lifespan)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")

def read_html(path: Path) -> HTMLResponse:
    """Utility to serve static HTML files."""
    if path.exists():
        return HTMLResponse(content=path.read_text(encoding="utf-8"))
    return HTMLResponse(f"<h2>File not found: {path.name}</h2>", status_code=404)

# Frontend routes
@app.get("/dashboard", response_class=HTMLResponse)
def dashboard():
    return read_html(DASHBOARD_FILE)

@app.get("/", response_class=HTMLResponse)
@app.get("/workspace", response_class=HTMLResponse)
def workspace():
    return read_html(WORKSPACE_FILE)

@app.get("/login", response_class=HTMLResponse)
@app.get("/signin", response_class=HTMLResponse)
def login():
    return read_html(LOGIN_FILE)

@app.get("/api/status")
def status():
    return {"status": "online", "version": "3.0"}

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("🚀  RefactorAI is starting...")
    print("🌐  Open:  http://127.0.0.1:8080")
    print("🔑  Login: http://127.0.0.1:8080/login")
    print("=" * 50 + "\n")
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=False)
