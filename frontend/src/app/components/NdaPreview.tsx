"use client";

import { forwardRef } from "react";
import { NdaFormData } from "../types";

interface NdaPreviewProps {
  formData: NdaFormData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "___________";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function blank(value: string): string {
  return value.trim() || "___________";
}

const NdaPreview = forwardRef<HTMLDivElement, NdaPreviewProps>(
  function NdaPreview({ formData }, ref) {
    const effectiveDate = formatDate(formData.effectiveDate);
    const mndaTerm =
      formData.mndaTermType === "expires"
        ? `${formData.mndaTermYears} year(s)`
        : "Continues until terminated";
    const confTerm =
      formData.confidentialityTermType === "expires"
        ? `${formData.confidentialityTermYears} year(s)`
        : "In perpetuity";

    return (
      <div
        ref={ref}
        className="bg-white text-black"
        style={{ fontFamily: "Georgia, serif", fontSize: "11pt", lineHeight: "1.6" }}
      >
        {/* Cover Page */}
        <h1
          style={{ fontSize: "18pt", fontWeight: "bold", textAlign: "center", marginBottom: "8px" }}
        >
          Mutual Non-Disclosure Agreement
        </h1>
        <p style={{ textAlign: "center", fontSize: "9pt", color: "#666", marginBottom: "24px" }}>
          Common Paper Mutual NDA (Version 1.0)
        </p>

        <p style={{ fontSize: "9pt", color: "#666", marginBottom: "16px" }}>
          This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists
          of: (1) this Cover Page and (2) the Common Paper Mutual NDA Standard
          Terms Version 1.0. Any modifications of the Standard Terms should be
          made on the Cover Page, which will control over conflicts with the
          Standard Terms.
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
          <tbody>
            <Row label="Purpose" value={blank(formData.purpose)} />
            <Row label="Effective Date" value={effectiveDate} />
            <Row label="MNDA Term" value={mndaTerm} />
            <Row label="Term of Confidentiality" value={confTerm} />
            <Row label="Governing Law" value={`State of ${blank(formData.governingLaw)}`} />
            <Row label="Jurisdiction" value={blank(formData.jurisdiction)} />
            {formData.modifications.trim() && (
              <Row label="Modifications" value={formData.modifications} />
            )}
          </tbody>
        </table>

        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
          By signing this Cover Page, each party agrees to enter into this MNDA
          as of the Effective Date.
        </p>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "32px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}></th>
              <th style={thStyle}>PARTY 1</th>
              <th style={thStyle}>PARTY 2</th>
            </tr>
          </thead>
          <tbody>
            <PartyRow label="Signature" v1="" v2="" />
            <PartyRow
              label="Print Name"
              v1={blank(formData.party1.name)}
              v2={blank(formData.party2.name)}
            />
            <PartyRow
              label="Title"
              v1={blank(formData.party1.title)}
              v2={blank(formData.party2.title)}
            />
            <PartyRow
              label="Company"
              v1={blank(formData.party1.company)}
              v2={blank(formData.party2.company)}
            />
            <PartyRow
              label="Notice Address"
              v1={blank(formData.party1.noticeAddress)}
              v2={blank(formData.party2.noticeAddress)}
            />
            <PartyRow label="Date" v1={effectiveDate} v2={effectiveDate} />
          </tbody>
        </table>

        {/* Page break for PDF */}
        <div style={{ pageBreakBefore: "always" }}></div>

        {/* Standard Terms */}
        <h2
          style={{ fontSize: "16pt", fontWeight: "bold", textAlign: "center", marginBottom: "16px" }}
        >
          Standard Terms
        </h2>

        <ol style={{ paddingLeft: "20px" }}>
          <li style={liStyle}>
            <strong>Introduction.</strong> This Mutual Non-Disclosure Agreement
            (which incorporates these Standard Terms and the Cover Page)
            (&ldquo;MNDA&rdquo;) allows each party (&ldquo;Disclosing
            Party&rdquo;) to disclose or make available information in connection
            with the Purpose which (1) the Disclosing Party identifies to the
            receiving party (&ldquo;Receiving Party&rdquo;) as
            &ldquo;confidential&rdquo;, &ldquo;proprietary&rdquo;, or the like
            or (2) should be reasonably understood as confidential or proprietary
            due to its nature and the circumstances of its disclosure
            (&ldquo;Confidential Information&rdquo;). Each party&rsquo;s
            Confidential Information also includes the existence and status of
            the parties&rsquo; discussions and information on the Cover Page.
            Confidential Information includes technical or business information,
            product designs or roadmaps, requirements, pricing, security and
            compliance documentation, technology, inventions and know-how. To use
            this MNDA, the parties must complete and sign a cover page
            incorporating these Standard Terms (&ldquo;Cover Page&rdquo;). Each
            party is identified on the Cover Page and capitalized terms have the
            meanings given herein or on the Cover Page.
          </li>
          <li style={liStyle}>
            <strong>Use and Protection of Confidential Information.</strong> The
            Receiving Party shall: (a) use Confidential Information solely for
            the Purpose; (b) not disclose Confidential Information to third
            parties without the Disclosing Party&rsquo;s prior written approval,
            except that the Receiving Party may disclose Confidential Information
            to its employees, agents, advisors, contractors and other
            representatives having a reasonable need to know for the Purpose,
            provided these representatives are bound by confidentiality
            obligations no less protective of the Disclosing Party than the
            applicable terms in this MNDA and the Receiving Party remains
            responsible for their compliance with this MNDA; and (c) protect
            Confidential Information using at least the same protections the
            Receiving Party uses for its own similar information but no less than
            a reasonable standard of care.
          </li>
          <li style={liStyle}>
            <strong>Exceptions.</strong> The Receiving Party&rsquo;s obligations
            in this MNDA do not apply to information that it can demonstrate: (a)
            is or becomes publicly available through no fault of the Receiving
            Party; (b) it rightfully knew or possessed prior to receipt from the
            Disclosing Party without confidentiality restrictions; (c) it
            rightfully obtained from a third party without confidentiality
            restrictions; or (d) it independently developed without using or
            referencing the Confidential Information.
          </li>
          <li style={liStyle}>
            <strong>Disclosures Required by Law.</strong> The Receiving Party may
            disclose Confidential Information to the extent required by law,
            regulation or regulatory authority, subpoena or court order, provided
            (to the extent legally permitted) it provides the Disclosing Party
            reasonable advance notice of the required disclosure and reasonably
            cooperates, at the Disclosing Party&rsquo;s expense, with the
            Disclosing Party&rsquo;s efforts to obtain confidential treatment
            for the Confidential Information.
          </li>
          <li style={liStyle}>
            <strong>Term and Termination.</strong> This MNDA commences on the
            Effective Date and expires at the end of the MNDA Term. Either party
            may terminate this MNDA for any or no reason upon written notice to
            the other party. The Receiving Party&rsquo;s obligations relating to
            Confidential Information will survive for the Term of
            Confidentiality, despite any expiration or termination of this MNDA.
          </li>
          <li style={liStyle}>
            <strong>
              Return or Destruction of Confidential Information.
            </strong>{" "}
            Upon expiration or termination of this MNDA or upon the Disclosing
            Party&rsquo;s earlier request, the Receiving Party will: (a) cease
            using Confidential Information; (b) promptly after the Disclosing
            Party&rsquo;s written request, destroy all Confidential Information
            in the Receiving Party&rsquo;s possession or control or return it to
            the Disclosing Party; and (c) if requested by the Disclosing Party,
            confirm its compliance with these obligations in writing. As an
            exception to subsection (b), the Receiving Party may retain
            Confidential Information in accordance with its standard backup or
            record retention policies or as required by law, but the terms of
            this MNDA will continue to apply to the retained Confidential
            Information.
          </li>
          <li style={liStyle}>
            <strong>Proprietary Rights.</strong> The Disclosing Party retains all
            of its intellectual property and other rights in its Confidential
            Information and its disclosure to the Receiving Party grants no
            license under such rights.
          </li>
          <li style={liStyle}>
            <strong>Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED
            &ldquo;AS IS&rdquo;, WITH ALL FAULTS, AND WITHOUT WARRANTIES,
            INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND
            FITNESS FOR A PARTICULAR PURPOSE.
          </li>
          <li style={liStyle}>
            <strong>Governing Law and Jurisdiction.</strong> This MNDA and all
            matters relating hereto are governed by, and construed in accordance
            with, the laws of the State of{" "}
            {blank(formData.governingLaw)}, without regard to the
            conflict of laws provisions of such State. Any legal suit, action, or
            proceeding relating to this MNDA must be instituted in the federal or
            state courts located in {blank(formData.jurisdiction)}.
            Each party irrevocably submits to the exclusive jurisdiction of such
            courts in any such suit, action, or proceeding.
          </li>
          <li style={liStyle}>
            <strong>Equitable Relief.</strong> A breach of this MNDA may cause
            irreparable harm for which monetary damages are an insufficient
            remedy. Upon a breach of this MNDA, the Disclosing Party is entitled
            to seek appropriate equitable relief, including an injunction, in
            addition to its other remedies.
          </li>
          <li style={liStyle}>
            <strong>General.</strong> Neither party has an obligation under this
            MNDA to disclose Confidential Information to the other or proceed
            with any proposed transaction. Neither party may assign this MNDA
            without the prior written consent of the other party, except that
            either party may assign this MNDA in connection with a merger,
            reorganization, acquisition or other transfer of all or substantially
            all its assets or voting securities. Any assignment in violation of
            this Section is null and void. This MNDA will bind and inure to the
            benefit of each party&rsquo;s permitted successors and assigns.
            Waivers must be signed by the waiving party&rsquo;s authorized
            representative and cannot be implied from conduct. If any provision
            of this MNDA is held unenforceable, it will be limited to the
            minimum extent necessary so the rest of this MNDA remains in effect.
            This MNDA (including the Cover Page) constitutes the entire agreement
            of the parties with respect to its subject matter, and supersedes all
            prior and contemporaneous understandings, agreements,
            representations, and warranties, whether written or oral, regarding
            such subject matter. This MNDA may only be amended, modified, waived,
            or supplemented by an agreement in writing signed by both parties.
            Notices, requests and approvals under this MNDA must be sent in
            writing to the email or postal addresses on the Cover Page and are
            deemed delivered on receipt. This MNDA may be executed in
            counterparts, including electronic copies, each of which is deemed an
            original and which together form the same agreement.
          </li>
        </ol>

        <p
          style={{
            marginTop: "24px",
            fontSize: "9pt",
            color: "#666",
            textAlign: "center",
          }}
        >
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use
          under CC BY 4.0.
        </p>
      </div>
    );
  }
);

const thStyle: React.CSSProperties = {
  borderBottom: "2px solid #333",
  padding: "8px",
  textAlign: "left",
  fontSize: "10pt",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "8px",
  fontSize: "10pt",
  verticalAlign: "top",
};

const liStyle: React.CSSProperties = {
  marginBottom: "12px",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          ...tdStyle,
          fontWeight: "bold",
          width: "30%",
        }}
      >
        {label}
      </td>
      <td style={tdStyle}>{value}</td>
    </tr>
  );
}

function PartyRow({ label, v1, v2 }: { label: string; v1: string; v2: string }) {
  return (
    <tr>
      <td style={{ ...tdStyle, fontWeight: "bold" }}>{label}</td>
      <td style={tdStyle}>{v1}</td>
      <td style={tdStyle}>{v2}</td>
    </tr>
  );
}

export default NdaPreview;
