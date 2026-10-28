# models.py
"""Lightweight SQLite-backed models for RefactorAI.
This project intentionally keeps a minimal, dependency-free data layer
so the app can run reliably in constrained environments.
"""

from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    id: int | None = None
    email: str = ""
    name: str = ""
    pwd_hash: str = ""


@dataclass
class Analysis:
    id: int | None = None
    user_id: int = 0
    filename: str = ""
    language: str = ""
    score: float = 0.0
    status: str = "pending"
    created_at: datetime | None = None
