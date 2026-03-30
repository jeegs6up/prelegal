"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NdaForm from "./components/NdaForm";
import NdaPreview from "./components/NdaPreview";
import GenericForm from "./components/GenericForm";
import GenericPreview from "./components/GenericPreview";
import ChatPanel from "./components/ChatPanel";
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
    name:
      incoming.name != null ? (incoming.name as string) : existing.name,
    title:
      incoming.title != null ? (incoming.title as string) : existing.title,
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

export default function Home() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedDocType, setSelectedDocType] = useState("mutual-nda");
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);

  // NDA-specific state
  const [ndaFormData, setNdaFormData] = useState<NdaFormData>(defaultFormData);

  // Generic document state
  const [genericFields, setGenericFields] = useState<DocumentFields>({});

  const [downloading, setDownloading] = useState(false);
  const [ready, setReady] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isNda = selectedDocType === "mutual-nda";

  useEffect(() => {
    if (localStorage.getItem("prelegal_logged_in") !== "true") {
      router.push("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  // Fetch document types for dropdown
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
        // Initialize generic fields with defaults
        if (selectedDocType !== "mutual-nda") {
          const defaults: DocumentFields = {};
          for (const f of data.fields) {
            defaults[f.name] = f.default || "";
          }
          setGenericFields(defaults);
        }
      });
  }, [selectedDocType]);

  // Get current fields as flat dict for chat
  const currentFieldsForChat = useCallback((): DocumentFields => {
    if (isNda) {
      // Flatten NDA form data for chat
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
            } else if (
              key.startsWith("party1_") &&
              value != null
            ) {
              const subKey = key.replace("party1_", "") as keyof PartyInfo;
              updated.party1 = { ...prev.party1, [subKey]: value as string };
            } else if (
              key.startsWith("party2_") &&
              value != null
            ) {
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

  function handleSignOut() {
    localStorage.removeItem("prelegal_logged_in");
    router.push("/login");
  }

  function handleDocTypeChange(slug: string) {
    setSelectedDocType(slug);
  }

  if (!ready) return null;

  const docName =
    documentTypes.find((d) => d.slug === selectedDocType)?.name || "Document";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-dark-navy">Prelegal</h1>
          <select
            value={selectedDocType}
            onChange={(e) => handleDocTypeChange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
          >
            {documentTypes.map((dt) => (
              <option key={dt.slug} value={dt.slug}>
                {dt.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-text transition-colors hover:bg-gray-100"
        >
          Sign Out
        </button>
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
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-6 w-full rounded-md bg-purple-secondary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
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
          </div>
        </div>

        {/* Right: Chat Panel — equal width */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-6 h-[calc(100vh-120px)] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <ChatPanel
              formData={currentFieldsForChat()}
              documentType={selectedDocType}
              onFieldsExtracted={handleFieldsExtracted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
