# analysis.py
"""API routes for fetching user analysis history."""

import sqlite3
from pathlib import Path

from fastapi import APIRouter, Depends

from auth import get_current_user

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "refactorai.db"

router = APIRouter()


@router.get("/analysis/recent")
def recent_analyses(current_user=Depends(get_current_user)):
    """Return recent analysis records for the authenticated user."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute(
            "SELECT id, filename, language, score, status, created_at FROM analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
            (current_user.id,),
        ).fetchall()
    finally:
        conn.close()

    return [
        {
            "id": row["id"],
            "filename": row["filename"],
            "language": row["language"],
            "score": row["score"],
            "status": row["status"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]
