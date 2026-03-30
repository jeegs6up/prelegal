"""Prelegal backend — serves static frontend and API."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from auth import (
    COOKIE_NAME,
    create_token,
    get_current_user,
    signin,
    signup,
)
from chat import chat, get_greeting
from database import init_db
from documents import get_document, get_document_types
from saved_docs import (
    delete_document,
    get_document as get_saved_document,
    list_documents,
    save_document,
)

STATIC_DIR = Path(__file__).parent / "static"
TEMPLATES_DIR = Path(__file__).parent / "templates"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prelegal", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],
    allow_origin_regex=r"https?://.*",
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# --- Health ---


@app.get("/api/health")
def health():
    return {"status": "ok"}


# --- Auth ---


class AuthRequest(BaseModel):
    email: str
    password: str


@app.post("/api/auth/signup")
def auth_signup(req: AuthRequest):
    user = signup(req.email, req.password)
    token = create_token(user["id"], user["email"])
    response = JSONResponse({"id": user["id"], "email": user["email"]})
    response.set_cookie(
        COOKIE_NAME, token, httponly=True, samesite="lax", max_age=86400
    )
    return response


@app.post("/api/auth/signin")
def auth_signin(req: AuthRequest):
    user = signin(req.email, req.password)
    token = create_token(user["id"], user["email"])
    response = JSONResponse({"id": user["id"], "email": user["email"]})
    response.set_cookie(
        COOKIE_NAME, token, httponly=True, samesite="lax", max_age=86400
    )
    return response


@app.post("/api/auth/signout")
def auth_signout():
    response = JSONResponse({"ok": True})
    response.delete_cookie(COOKIE_NAME)
    return response


@app.get("/api/auth/me")
def auth_me(user: dict = Depends(get_current_user)):
    return {"id": user["id"], "email": user["email"]}


# --- Document Types & Templates ---


@app.get("/api/documents/types")
def document_types():
    return get_document_types()


@app.get("/api/documents/template/{slug}")
def document_template(slug: str):
    doc = get_document(slug)
    if not doc:
        raise HTTPException(status_code=404, detail="Unknown document type")
    template_path = TEMPLATES_DIR / doc["filename"]
    content = template_path.read_text() if template_path.exists() else ""
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


# --- Saved Documents (auth required) ---


class SaveDocRequest(BaseModel):
    docType: str
    name: str
    fields: dict


@app.get("/api/user/documents")
def user_documents(user: dict = Depends(get_current_user)):
    return list_documents(user["id"])


@app.post("/api/user/documents")
def user_save_document(req: SaveDocRequest, user: dict = Depends(get_current_user)):
    return save_document(user["id"], req.docType, req.name, req.fields)


@app.get("/api/user/documents/{doc_id}")
def user_get_document(doc_id: int, user: dict = Depends(get_current_user)):
    return get_saved_document(user["id"], doc_id)


@app.delete("/api/user/documents/{doc_id}")
def user_delete_document(doc_id: int, user: dict = Depends(get_current_user)):
    delete_document(user["id"], doc_id)
    return {"ok": True}


# --- Chat ---


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
