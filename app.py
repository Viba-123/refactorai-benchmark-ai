"""
RefactorAI - Universal Code Quality Benchmarking & AI Refactoring Platform
College Mini Project | FastAPI + SQLite
"""

from pathlib import Path
import sqlite3
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from contextlib import asynccontextmanager
import uvicorn

BASE_DIR = Path(__file__).parent
WORKSPACE_FILE = BASE_DIR / "workspace.html"
LOGIN_FILE     = BASE_DIR / "login.html"
DB_PATH        = BASE_DIR / "refactorai.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS benchmark_history (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            filename    TEXT,
            language    TEXT,
            runtime_ms  INTEGER,
            memory_mb   REAL,
            timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP
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


def read_html(path: Path) -> HTMLResponse:
    if path.exists():
        return HTMLResponse(content=path.read_text(encoding="utf-8"))
    return HTMLResponse(f"<h2>File not found: {path.name}</h2>", status_code=404)


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
    print("\n" + "="*50)
    print("🚀  RefactorAI is starting...")
    print("🌐  Open:  http://127.0.0.1:8080")
    print("🔑  Login: http://127.0.0.1:8080/login")
    print("="*50 + "\n")
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=False)
