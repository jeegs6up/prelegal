export interface PartyInfo {
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export type MndaTermType = "expires" | "perpetual";
export type ConfidentialityTermType = "expires" | "perpetual";

export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: MndaTermType;
  mndaTermYears: string;
  confidentialityTermType: ConfidentialityTermType;
  confidentialityTermYears: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: PartyInfo;
  party2: PartyInfo;
}

export const defaultFormData: NdaFormData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermType: "expires",
  mndaTermYears: "1",
  confidentialityTermType: "expires",
  confidentialityTermYears: "1",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { name: "", title: "", company: "", noticeAddress: "" },
  party2: { name: "", title: "", company: "", noticeAddress: "" },
};

export interface DocumentType {
  slug: string;
  name: string;
  description: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "radio";
  default: string;
  options?: string[];
}

export interface DocumentTemplate {
  content: string;
  standardTerms: string;
  fields: FieldDefinition[];
  name: string;
  parties: string[];
}

export type DocumentFields = Record<string, string>;
