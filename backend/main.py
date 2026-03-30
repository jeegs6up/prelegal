"""Prelegal backend — serves static frontend and API."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from chat import chat, get_greeting
from database import init_db
from documents import get_document, get_document_types

STATIC_DIR = Path(__file__).parent / "static"
TEMPLATES_DIR = Path(__file__).parent / "templates"


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


@app.get("/api/documents/types")
def document_types():
    return get_document_types()


@app.get("/api/documents/template/{slug}")
def document_template(slug: str):
    doc = get_document(slug)
    if not doc:
        raise HTTPException(status_code=404, detail="Unknown document type")
    # Read the template markdown
    template_path = TEMPLATES_DIR / doc["filename"]
    content = template_path.read_text() if template_path.exists() else ""
    # Also read standard terms if they exist
    standard_terms = ""
    if "standard_terms_filename" in doc:
        terms_path = TEMPLATES_DIR / doc["standard_terms_filename"]
        if terms_path.exists():
            standard_terms = terms_path.read_text()
    return {
        "content": content,
        "standardTerms": standard_terms,
        "fields": doc["fields"],
        "name": doc["name"],
        "parties": doc["parties"],
    }


@app.get("/api/chat/greeting")
def chat_greeting(doc_type: str = "mutual-nda"):
    return {"message": get_greeting(doc_type)}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    currentFields: dict
    documentType: str = "mutual-nda"


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
    result = chat(messages, req.currentFields, req.documentType)
    fields = strip_empty(result.fields) if result.fields else {}
    return {"message": result.message, "fields": fields}


# Serve the static Next.js export — must be last so API routes take priority
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
