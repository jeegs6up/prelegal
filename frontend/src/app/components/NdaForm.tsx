"use client";

import { NdaFormData, PartyInfo } from "../types";

interface NdaFormProps {
  formData: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

function PartyFields({
  label,
  party,
  onChange,
}: {
  label: string;
  party: PartyInfo;
  onChange: (party: PartyInfo) => void;
}) {
  return (
    <fieldset className="rounded-lg border border-gray-200 p-4">
      <legend className="px-2 text-sm font-semibold text-dark-navy">
        {label}
      </legend>
      <div className="grid gap-3">
        <input
          type="text"
          placeholder="Full Name"
          value={party.name}
          onChange={(e) => onChange({ ...party, name: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
        />
        <input
          type="text"
          placeholder="Title"
          value={party.title}
          onChange={(e) => onChange({ ...party, title: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
        />
        <input
          type="text"
          placeholder="Company"
          value={party.company}
          onChange={(e) => onChange({ ...party, company: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
        />
        <input
          type="text"
          placeholder="Notice Address (email or postal)"
          value={party.noticeAddress}
          onChange={(e) =>
            onChange({ ...party, noticeAddress: e.target.value })
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
        />
      </div>
    </fieldset>
  );
}

export default function NdaForm({ formData, onChange }: NdaFormProps) {
  const update = (partial: Partial<NdaFormData>) =>
    onChange({ ...formData, ...partial });

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-dark-navy">
        Mutual NDA Details
      </h2>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-dark-navy">Purpose</span>
        <textarea
          rows={2}
          value={formData.purpose}
          onChange={(e) => update({ purpose: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-dark-navy">
          Effective Date
        </span>
        <input
          type="date"
          value={formData.effectiveDate}
          onChange={(e) => update({ effectiveDate: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-dark-navy">MNDA Term</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mndaTerm"
            checked={formData.mndaTermType === "expires"}
            onChange={() => update({ mndaTermType: "expires" })}
          />
          Expires after
          <input
            type="number"
            min="1"
            value={formData.mndaTermYears}
            onChange={(e) => update({ mndaTermYears: e.target.value })}
            disabled={formData.mndaTermType !== "expires"}
            className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none disabled:opacity-50"
          />
          year(s) from Effective Date
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mndaTerm"
            checked={formData.mndaTermType === "perpetual"}
            onChange={() => update({ mndaTermType: "perpetual" })}
          />
          Continues until terminated
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-dark-navy">
          Term of Confidentiality
        </legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="confTerm"
            checked={formData.confidentialityTermType === "expires"}
            onChange={() => update({ confidentialityTermType: "expires" })}
          />
          <span>
            <input
              type="number"
              min="1"
              value={formData.confidentialityTermYears}
              onChange={(e) =>
                update({ confidentialityTermYears: e.target.value })
              }
              disabled={formData.confidentialityTermType !== "expires"}
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none disabled:opacity-50"
            />{" "}
            year(s) from Effective Date (trade secrets protected until no longer
            considered trade secrets)
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="confTerm"
            checked={formData.confidentialityTermType === "perpetual"}
            onChange={() => update({ confidentialityTermType: "perpetual" })}
          />
          In perpetuity
        </label>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-dark-navy">
            Governing Law (State)
          </span>
          <input
            type="text"
            placeholder="e.g. Delaware"
            value={formData.governingLaw}
            onChange={(e) => update({ governingLaw: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-dark-navy">
            Jurisdiction
          </span>
          <input
            type="text"
            placeholder="e.g. courts located in New Castle, DE"
            value={formData.jurisdiction}
            onChange={(e) => update({ jurisdiction: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-dark-navy">
          Modifications (optional)
        </span>
        <textarea
          rows={2}
          value={formData.modifications}
          onChange={(e) => update({ modifications: e.target.value })}
          placeholder="List any modifications to the standard terms"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <PartyFields
          label="Party 1"
          party={formData.party1}
          onChange={(party1) => update({ party1 })}
        />
        <PartyFields
          label="Party 2"
          party={formData.party2}
          onChange={(party2) => update({ party2 })}
        />
      </div>
    </div>
  );
}
