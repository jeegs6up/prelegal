"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NdaForm from "./components/NdaForm";
import NdaPreview from "./components/NdaPreview";
import ChatPanel from "./components/ChatPanel";
import { NdaFormData, PartyInfo, defaultFormData } from "./types";

function mergeParty(existing: PartyInfo, incoming: Record<string, unknown>): PartyInfo {
  return {
    name: incoming.name != null ? (incoming.name as string) : existing.name,
    title: incoming.title != null ? (incoming.title as string) : existing.title,
    company: incoming.company != null ? (incoming.company as string) : existing.company,
    noticeAddress: incoming.noticeAddress != null ? (incoming.noticeAddress as string) : existing.noticeAddress,
  };
}

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const [downloading, setDownloading] = useState(false);
  const [ready, setReady] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("prelegal_logged_in") !== "true") {
      router.push("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleFieldsExtracted = useCallback((fields: Record<string, unknown>) => {
    setFormData((prev) => {
      const updated = { ...prev };
      for (const [key, value] of Object.entries(fields)) {
        if (key === "party1" && typeof value === "object" && value) {
          updated.party1 = mergeParty(prev.party1, value as Record<string, unknown>);
        } else if (key === "party2" && typeof value === "object" && value) {
          updated.party2 = mergeParty(prev.party2, value as Record<string, unknown>);
        } else if (key in prev && value !== null && value !== undefined) {
          (updated as Record<string, unknown>)[key] = value;
        }
      }
      return updated;
    });
  }, []);

  async function handleDownload() {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const filename =
        formData.party1.company && formData.party2.company
          ? `Mutual-NDA_${formData.party1.company}_${formData.party2.company}.pdf`
          : "Mutual-NDA.pdf";
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

  if (!ready) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-dark-navy">
            Prelegal &mdash; Mutual NDA Creator
          </h1>
          <p className="text-sm text-gray-text">
            Chat with our AI assistant to create your NDA, or edit fields
            directly.
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-text transition-colors hover:bg-gray-100"
        >
          Sign Out
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Left: Form + Preview stacked */}
        <div className="w-full shrink-0 space-y-6 lg:w-[420px]">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <NdaForm formData={formData} onChange={setFormData} />
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-6 w-full rounded-md bg-purple-secondary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <NdaPreview ref={previewRef} formData={formData} />
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="flex-1">
          <div className="sticky top-6 h-[calc(100vh-120px)] rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <ChatPanel
              formData={formData}
              onFieldsExtracted={handleFieldsExtracted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
