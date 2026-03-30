"""Prelegal backend — serves static frontend and API."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from chat import chat, get_greeting
from database import init_db

STATIC_DIR = Path(__file__).parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prelegal", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/chat/greeting")
def chat_greeting():
    return {"message": get_greeting()}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    currentFields: dict


def strip_empty(obj: dict) -> dict:
    """Remove keys with None or empty string values, recursively."""
    cleaned = {}
    for k, v in obj.items():
        if isinstance(v, dict):
            nested = strip_empty(v)
            if nested:
                cleaned[k] = nested
        elif v is not None and v != "":
            cleaned[k] = v
    return cleaned


@app.post("/api/chat/message")
def chat_message(req: ChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    result = chat(messages, req.currentFields)
    fields = strip_empty(result.fields.model_dump())
    return {"message": result.message, "fields": fields}


# Serve the static Next.js export — must be last so API routes take priority
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
