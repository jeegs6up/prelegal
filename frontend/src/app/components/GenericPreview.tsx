"use client";

import { forwardRef, useMemo } from "react";
import { DocumentFields } from "../types";

interface GenericPreviewProps {
  templateContent: string;
  standardTerms: string;
  fields: DocumentFields;
  documentName: string;
}

function substituteFields(content: string, fields: DocumentFields): string {
  let result = content;

  // Replace <span class="coverpage_link">FieldName</span> patterns
  result = result.replace(
    /<span class="(?:coverpage_link|orderform_link|keyterms_link|businessterms_link|sow_link)">([^<]+)<\/span>/g,
    (_, fieldName: string) => {
      // Try exact match first, then camelCase conversion
      const camelKey = fieldName
        .replace(/\s+/g, "")
        .replace(/^./, (c) => c.toLowerCase());
      const value =
        fields[fieldName] || fields[camelKey] || `[${fieldName}]`;
      return `<strong>${value}</strong>`;
    }
  );

  // Replace [placeholder text] bracket patterns (cover page style)
  // Use negative lookahead to avoid consuming markdown links [text](url)
  result = result.replace(
    /\[([^\]]+)\](?!\()/g,
    (match) => {
      // Leave checkboxes and non-placeholder brackets as-is
      if (match === "[x]" || match === "[ ]") return match;
      return match;
    }
  );

  return result;
}

function markdownToHtml(md: string): string {
  let html = md;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:13pt;font-weight:bold;margin:16px 0 8px;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:15pt;font-weight:bold;margin:20px 0 10px;">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:18pt;font-weight:bold;text-align:center;margin-bottom:8px;">$1</h1>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs — wrap non-tag lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<table") || trimmed.startsWith("<label")) {
        return trimmed;
      }
      return `<p style="margin-bottom:10px;">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}

const GenericPreview = forwardRef<HTMLDivElement, GenericPreviewProps>(
  function GenericPreview({ templateContent, standardTerms, fields, documentName }, ref) {
    const renderedContent = useMemo(() => {
      const substituted = substituteFields(templateContent, fields);
      return markdownToHtml(substituted);
    }, [templateContent, fields]);

    const renderedTerms = useMemo(() => {
      if (!standardTerms) return "";
      const substituted = substituteFields(standardTerms, fields);
      return markdownToHtml(substituted);
    }, [standardTerms, fields]);

    return (
      <div
        ref={ref}
        className="bg-white text-black"
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "11pt",
          lineHeight: "1.6",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: renderedContent }} />

        {renderedTerms && (
          <>
            <div style={{ pageBreakBefore: "always" }} />
            <h2
              style={{
                fontSize: "16pt",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              Standard Terms
            </h2>
            <div dangerouslySetInnerHTML={{ __html: renderedTerms }} />
          </>
        )}

        <p
          style={{
            marginTop: "24px",
            fontSize: "9pt",
            color: "#666",
            textAlign: "center",
          }}
        >
          {documentName} — CommonPaper Standard Terms, free to use under CC BY
          4.0.
        </p>
      </div>
    );
  }
);

export default GenericPreview;
