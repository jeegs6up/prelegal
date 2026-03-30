"""CRUD operations for saved documents."""

import json

from fastapi import HTTPException

from database import get_connection


def list_documents(user_id: int) -> list[dict]:
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT id, doc_type, name, created_at FROM saved_documents WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,),
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def save_document(user_id: int, doc_type: str, name: str, fields: dict) -> dict:
    conn = get_connection()
    try:
        cursor = conn.execute(
            "INSERT INTO saved_documents (user_id, doc_type, name, fields_json) VALUES (?, ?, ?, ?)",
            (user_id, doc_type, name, json.dumps(fields)),
        )
        conn.commit()
        return {"id": cursor.lastrowid, "doc_type": doc_type, "name": name}
    finally:
        conn.close()


def get_document(user_id: int, doc_id: int) -> dict:
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT id, doc_type, name, fields_json, created_at FROM saved_documents WHERE id = ? AND user_id = ?",
            (doc_id, user_id),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")
        result = dict(row)
        result["fields"] = json.loads(result.pop("fields_json"))
        return result
    finally:
        conn.close()


def delete_document(user_id: int, doc_id: int):
    conn = get_connection()
    try:
        cursor = conn.execute(
            "DELETE FROM saved_documents WHERE id = ? AND user_id = ?",
            (doc_id, user_id),
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Document not found")
    finally:
        conn.close()
