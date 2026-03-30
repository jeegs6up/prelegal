"use client";

import { useEffect, useState } from "react";

interface SavedDoc {
  id: number;
  doc_type: string;
  name: string;
  created_at: string;
}

interface MyDocumentsModalProps {
  open: boolean;
  onClose: () => void;
  onLoad: (doc: { id: number; doc_type: string; name: string; fields: Record<string, string> }) => void;
}

export default function MyDocumentsModal({
  open,
  onClose,
  onLoad,
}: MyDocumentsModalProps) {
  const [docs, setDocs] = useState<SavedDoc[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/user/documents", { credentials: "include" })
      .then((r) => r.json())
      .then(setDocs)
      .finally(() => setLoading(false));
  }, [open]);

  async function handleLoad(id: number) {
    const res = await fetch(`/api/user/documents/${id}`, { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    onLoad(data);
    onClose();
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/user/documents/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setDocs((prev) => prev.filter((d) => d.id !== id));
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-dark-navy">
            My Documents
          </h2>
          <button
            onClick={onClose}
            className="text-gray-text hover:text-dark-navy"
          >
            &times;
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-6">
          {loading ? (
            <p className="text-sm text-gray-text">Loading...</p>
          ) : docs.length === 0 ? (
            <p className="text-sm text-gray-text">
              No saved documents yet. Create a document and save it to see it
              here.
            </p>
          ) : (
            <div className="space-y-3">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-dark-navy">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-text">
                      {doc.doc_type} &middot;{" "}
                      {new Date(doc.created_at + "Z").toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(doc.id)}
                      className="rounded-md bg-blue-primary px-3 py-1 text-xs font-medium text-white hover:opacity-90"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-text hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
