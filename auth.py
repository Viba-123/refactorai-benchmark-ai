# auth.py
"""Authentication router for RefactorAI.
Provides register, login, logout, and current user endpoints.
Uses Passlib (bcrypt) for password hashing and python‑jose for JWT.
All routes return JSON; UI will interact via fetch() from the HTML pages.
"""

import os
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from models import User

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "refactorai.db"

# ---------------------------------------------------------------------------
# Config & helpers
# ---------------------------------------------------------------------------
SECRET_KEY = os.getenv("REFORACTAI_JWT_SECRET", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(request: Request, db: sqlite3.Connection = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    row = db.execute("SELECT id, email, name, pwd_hash FROM users WHERE email = ?", (email,)).fetchone()
    if row is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return User(id=row["id"], email=row["email"], name=row["name"], pwd_hash=row["pwd_hash"])


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("/register")
def register(payload: dict, response: Response, db: sqlite3.Connection = Depends(get_db)):
    email = payload.get("email")
    name = payload.get("name")
    password = payload.get("password")
    if not email or not name or not password:
        raise HTTPException(status_code=400, detail="All fields are required")
    if "@" not in email or len(password) < 6:
        raise HTTPException(status_code=400, detail="Invalid email or password too short")

    existing = db.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    db.execute(
        "INSERT INTO users (email, name, pwd_hash) VALUES (?, ?, ?)",
        (email, name, get_password_hash(password)),
    )
    db.commit()
    token = create_access_token({"sub": email})
    response.set_cookie(key="access_token", value=token, httponly=True, max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return {"msg": "registered", "user": {"email": email, "name": name}}


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), response: Response = None, db: sqlite3.Connection = Depends(get_db)):
    row = db.execute("SELECT id, email, name, pwd_hash FROM users WHERE email = ?", (form.username,)).fetchone()
    if not row or not verify_password(form.password, row["pwd_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    user = User(id=row["id"], email=row["email"], name=row["name"], pwd_hash=row["pwd_hash"])
    token = create_access_token({"sub": user.email})
    response.set_cookie(key="access_token", value=token, httponly=True, max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return {"msg": "logged_in", "user": {"email": user.email, "name": user.name}}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"msg": "logged_out"}


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "name": current_user.name}
