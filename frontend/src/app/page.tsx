"use client";

import { useRef, useState } from "react";
import NdaForm from "./components/NdaForm";
import NdaPreview from "./components/NdaPreview";
import { NdaFormData, defaultFormData } from "./types";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const filename = formData.party1.company && formData.party2.company
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

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-zinc-900">
          Prelegal &mdash; Mutual NDA Creator
        </h1>
        <p className="text-sm text-zinc-500">
          Fill in the details below. Preview your NDA on the right and download
          as PDF.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Left: Form */}
        <div className="w-full shrink-0 lg:w-[420px]">
          <div className="sticky top-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <NdaForm formData={formData} onChange={setFormData} />
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 overflow-auto">
          <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
            <NdaPreview ref={previewRef} formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
