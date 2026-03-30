"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NdaForm from "./components/NdaForm";
import NdaPreview from "./components/NdaPreview";
import GenericForm from "./components/GenericForm";
import GenericPreview from "./components/GenericPreview";
import ChatPanel from "./components/ChatPanel";
import MyDocumentsModal from "./components/MyDocumentsModal";
import {
  NdaFormData,
  PartyInfo,
  defaultFormData,
  DocumentType,
  DocumentTemplate,
  DocumentFields,
} from "./types";

const API_BASE = "/api";

function mergeParty(
  existing: PartyInfo,
  incoming: Record<string, unknown>
): PartyInfo {
  return {
    name: incoming.name != null ? (incoming.name as string) : existing.name,
    title: incoming.title != null ? (incoming.title as string) : existing.title,
    company:
      incoming.company != null
        ? (incoming.company as string)
        : existing.company,
    noticeAddress:
      incoming.noticeAddress != null
        ? (incoming.noticeAddress as string)
        : existing.noticeAddress,
  };
}

interface User {
  id: number;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedDocType, setSelectedDocType] = useState("mutual-nda");
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);

  const [ndaFormData, setNdaFormData] = useState<NdaFormData>(defaultFormData);
  const [genericFields, setGenericFields] = useState<DocumentFields>({});

  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isNda = selectedDocType === "mutual-nda";

  // Check auth via cookie
  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setUser(data);
        setReady(true);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  // Fetch document types
  useEffect(() => {
    fetch(`${API_BASE}/documents/types`)
      .then((r) => r.json())
      .then(setDocumentTypes);
  }, []);

  // Fetch template when document type changes
  useEffect(() => {
    fetch(`${API_BASE}/documents/template/${selectedDocType}`)
      .then((r) => r.json())
      .then((data: DocumentTemplate) => {
        setTemplate(data);
        if (selectedDocType !== "mutual-nda") {
          const defaults: DocumentFields = {};
          for (const f of data.fields) {
            defaults[f.name] = f.default || "";
          }
          setGenericFields(defaults);
        }
      });
  }, [selectedDocType]);

  const currentFieldsForChat = useCallback((): DocumentFields => {
    if (isNda) {
      return {
        purpose: ndaFormData.purpose,
        effectiveDate: ndaFormData.effectiveDate,
        mndaTermType: ndaFormData.mndaTermType,
        mndaTermYears: ndaFormData.mndaTermYears,
        confidentialityTermType: ndaFormData.confidentialityTermType,
        confidentialityTermYears: ndaFormData.confidentialityTermYears,
        governingLaw: ndaFormData.governingLaw,
        jurisdiction: ndaFormData.jurisdiction,
        modifications: ndaFormData.modifications,
        party1_company: ndaFormData.party1.company,
        party1_name: ndaFormData.party1.name,
        party1_title: ndaFormData.party1.title,
        party1_noticeAddress: ndaFormData.party1.noticeAddress,
        party2_company: ndaFormData.party2.company,
        party2_name: ndaFormData.party2.name,
        party2_title: ndaFormData.party2.title,
        party2_noticeAddress: ndaFormData.party2.noticeAddress,
      };
    }
    return genericFields;
  }, [isNda, ndaFormData, genericFields]);

  const handleFieldsExtracted = useCallback(
    (fields: Record<string, unknown>) => {
      if (isNda) {
        setNdaFormData((prev) => {
          const updated = { ...prev };
          for (const [key, value] of Object.entries(fields)) {
            if (key === "party1" && typeof value === "object" && value) {
              updated.party1 = mergeParty(
                prev.party1,
                value as Record<string, unknown>
              );
            } else if (key === "party2" && typeof value === "object" && value) {
              updated.party2 = mergeParty(
                prev.party2,
                value as Record<string, unknown>
              );
            } else if (key.startsWith("party1_") && value != null) {
              const subKey = key.replace("party1_", "") as keyof PartyInfo;
              updated.party1 = { ...prev.party1, [subKey]: value as string };
            } else if (key.startsWith("party2_") && value != null) {
              const subKey = key.replace("party2_", "") as keyof PartyInfo;
              updated.party2 = { ...prev.party2, [subKey]: value as string };
            } else if (key in prev && value != null) {
              (updated as Record<string, unknown>)[key] = value;
            }
          }
          return updated;
        });
      } else {
        setGenericFields((prev) => {
          const updated = { ...prev };
          for (const [key, value] of Object.entries(fields)) {
            if (value != null && value !== "") {
              updated[key] = value as string;
            }
          }
          return updated;
        });
      }
    },
    [isNda]
  );

  async function handleDownload() {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const docName =
        documentTypes.find((d) => d.slug === selectedDocType)?.name ||
        "Document";
      const filename = `${docName.replace(/\s+/g, "-")}.pdf`;
      await html2pdf()
        .set({
          margin: [0.75, 0.75, 0.75, 0.75],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(previewRef.current)
        .save();
    } finally {
      setDownloading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const docName =
        documentTypes.find((d) => d.slug === selectedDocType)?.name ||
        "Document";
      const fields = isNda ? currentFieldsForChat() : genericFields;
      const res = await fetch(`${API_BASE}/user/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          docType: selectedDocType,
          name: docName,
          fields,
        }),
      });
      if (!res.ok) {
        alert("Failed to save document. Please try again.");
      }
    } catch {
      alert("Failed to save document. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleLoadDocument(doc: {
    doc_type: string;
    fields: Record<string, string>;
  }) {
    setSelectedDocType(doc.doc_type);
    if (doc.doc_type === "mutual-nda") {
      setNdaFormData((prev) => {
        const updated = { ...prev };
        for (const [key, value] of Object.entries(doc.fields)) {
          if (key.startsWith("party1_")) {
            const subKey = key.replace("party1_", "") as keyof PartyInfo;
            updated.party1 = { ...updated.party1, [subKey]: value };
          } else if (key.startsWith("party2_")) {
            const subKey = key.replace("party2_", "") as keyof PartyInfo;
            updated.party2 = { ...updated.party2, [subKey]: value };
          } else if (key in updated) {
            (updated as Record<string, unknown>)[key] = value;
          }
        }
        return updated;
      });
    } else {
      setGenericFields(doc.fields);
    }
  }

  function handleNewDocument() {
    if (isNda) {
      setNdaFormData(defaultFormData);
    } else if (template) {
      const defaults: DocumentFields = {};
      for (const f of template.fields) {
        defaults[f.name] = f.default || "";
      }
      setGenericFields(defaults);
    }
  }

  async function handleSignOut() {
    await fetch(`${API_BASE}/auth/signout`, { method: "POST", credentials: "include" });
    router.push("/login");
  }

  if (!ready) return null;

  const docName =
    documentTypes.find((d) => d.slug === selectedDocType)?.name || "Document";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-dark-navy">Prelegal</h1>
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
          >
            {documentTypes.map((dt) => (
              <option key={dt.slug} value={dt.slug}>
                {dt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNewDocument}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-text transition-colors hover:bg-gray-100"
          >
            New Document
          </button>
          <button
            onClick={() => setShowDocs(true)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-text transition-colors hover:bg-gray-100"
          >
            My Documents
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-dark-navy transition-colors hover:bg-gray-100"
            >
              {user?.email}
              <span className="text-xs">&#9662;</span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-gray-text hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Left: Form + Preview — equal width */}
        <div className="w-full space-y-6 lg:w-1/2">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            {isNda ? (
              <NdaForm formData={ndaFormData} onChange={setNdaFormData} />
            ) : (
              template && (
                <GenericForm
                  fields={template.fields}
                  values={genericFields}
                  onChange={setGenericFields}
                  documentName={docName}
                />
              )
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-md border border-purple-secondary px-4 py-2.5 text-sm font-medium text-purple-secondary transition-colors hover:bg-purple-50 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Document"}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 rounded-md bg-purple-secondary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {downloading ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            {isNda ? (
              <NdaPreview ref={previewRef} formData={ndaFormData} />
            ) : (
              template && (
                <GenericPreview
                  ref={previewRef}
                  templateContent={template.content}
                  standardTerms={template.standardTerms}
                  fields={genericFields}
                  documentName={docName}
                />
              )
            )}

            {/* Disclaimer */}
            <div className="mt-6 rounded-md border border-accent-yellow/30 bg-accent-yellow/10 px-4 py-3">
              <p className="text-xs text-dark-navy">
                <strong>Disclaimer:</strong> This document is a draft generated
                with AI assistance and is subject to legal review. It should not
                be considered legal advice. Please consult a qualified attorney
                before executing any legal agreement.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Chat Panel — equal width */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-6 h-[calc(100vh-100px)] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <ChatPanel
              formData={currentFieldsForChat()}
              documentType={selectedDocType}
              onFieldsExtracted={handleFieldsExtracted}
            />
          </div>
        </div>
      </div>

      <MyDocumentsModal
        open={showDocs}
        onClose={() => setShowDocs(false)}
        onLoad={handleLoadDocument}
      />
    </div>
  );
}
