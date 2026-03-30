"""Authentication — signup, signin, JWT in HttpOnly cookies."""

import os
from datetime import datetime, timedelta, timezone

import sqlite3

import bcrypt
import jwt
from fastapi import Cookie, HTTPException

from database import get_connection

SECRET_KEY = os.environ.get("JWT_SECRET", "dev-only-change-me")
ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 24
COOKIE_NAME = "prelegal_token"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_token(user_id: int, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    payload["sub"] = int(payload["sub"])
    return payload


def signup(email: str, password: str) -> dict:
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            (email, hash_password(password)),
        )
        conn.commit()
        user = conn.execute("SELECT id, email FROM users WHERE email = ?", (email,)).fetchone()
        return {"id": user["id"], "email": user["email"]}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()


def signin(email: str, password: str) -> dict:
    conn = get_connection()
    try:
        user = conn.execute("SELECT id, email, password_hash FROM users WHERE email = ?", (email,)).fetchone()
        if not user or not verify_password(password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return {"id": user["id"], "email": user["email"]}
    finally:
        conn.close()


def get_current_user(prelegal_token: str = Cookie(None)) -> dict:
    """FastAPI dependency — extracts user from HttpOnly cookie."""
    if not prelegal_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(prelegal_token)
        return {"id": payload["sub"], "email": payload["email"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
