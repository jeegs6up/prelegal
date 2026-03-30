"""Document type registry — defines fields and AI prompts for all supported document types."""

DOCUMENT_REGISTRY = {
    "mutual-nda": {
        "name": "Mutual NDA",
        "filename": "Mutual-NDA-coverpage.md",
        "standard_terms_filename": "Mutual-NDA.md",
        "description": "Mutual Non-Disclosure Agreement for protecting confidential information between two parties.",
        "parties": ["Party 1", "Party 2"],
        "fields": [
            {"name": "purpose", "label": "Purpose", "type": "textarea", "default": "Evaluating whether to enter into a business relationship with the other party."},
            {"name": "effectiveDate", "label": "Effective Date", "type": "date", "default": ""},
            {"name": "mndaTermType", "label": "MNDA Term", "type": "radio", "options": ["expires", "perpetual"], "default": "expires"},
            {"name": "mndaTermYears", "label": "MNDA Term (years)", "type": "text", "default": "1"},
            {"name": "confidentialityTermType", "label": "Confidentiality Term", "type": "radio", "options": ["expires", "perpetual"], "default": "expires"},
            {"name": "confidentialityTermYears", "label": "Confidentiality Term (years)", "type": "text", "default": "1"},
            {"name": "governingLaw", "label": "Governing Law (State)", "type": "text", "default": ""},
            {"name": "jurisdiction", "label": "Jurisdiction", "type": "text", "default": ""},
            {"name": "modifications", "label": "Modifications", "type": "textarea", "default": ""},
            {"name": "party1_company", "label": "Party 1 Company", "type": "text", "default": ""},
            {"name": "party1_name", "label": "Party 1 Name", "type": "text", "default": ""},
            {"name": "party1_title", "label": "Party 1 Title", "type": "text", "default": ""},
            {"name": "party1_noticeAddress", "label": "Party 1 Notice Address", "type": "text", "default": ""},
            {"name": "party2_company", "label": "Party 2 Company", "type": "text", "default": ""},
            {"name": "party2_name", "label": "Party 2 Name", "type": "text", "default": ""},
            {"name": "party2_title", "label": "Party 2 Title", "type": "text", "default": ""},
            {"name": "party2_noticeAddress", "label": "Party 2 Notice Address", "type": "text", "default": ""},
        ],
    },
    "csa": {
        "name": "Cloud Service Agreement",
        "filename": "CSA.md",
        "description": "Standard Cloud Service Agreement covering SaaS access, support, data protection, and liability.",
        "parties": ["Provider", "Customer"],
        "fields": [
            {"name": "provider", "label": "Provider Company", "type": "text", "default": ""},
            {"name": "customer", "label": "Customer Company", "type": "text", "default": ""},
            {"name": "effectiveDate", "label": "Effective Date", "type": "date", "default": ""},
            {"name": "subscriptionPeriod", "label": "Subscription Period", "type": "text", "default": ""},
            {"name": "technicalSupport", "label": "Technical Support", "type": "text", "default": ""},
            {"name": "useLimitations", "label": "Use Limitations", "type": "textarea", "default": ""},
            {"name": "paymentProcess", "label": "Payment Process", "type": "text", "default": ""},
            {"name": "orderDate", "label": "Order Date", "type": "date", "default": ""},
            {"name": "nonRenewalNoticeDate", "label": "Non-Renewal Notice Date", "type": "text", "default": ""},
            {"name": "generalCapAmount", "label": "General Cap Amount", "type": "text", "default": ""},
            {"name": "increasedClaims", "label": "Increased Claims", "type": "textarea", "default": ""},
            {"name": "increasedCapAmount", "label": "Increased Cap Amount", "type": "text", "default": ""},
            {"name": "providerCoveredClaims", "label": "Provider Covered Claims", "type": "textarea", "default": ""},
            {"name": "customerCoveredClaims", "label": "Customer Covered Claims", "type": "textarea", "default": ""},
            {"name": "governingLaw", "label": "Governing Law", "type": "text", "default": ""},
            {"name": "chosenCourts", "label": "Chosen Courts", "type": "text", "default": ""},
            {"name": "securityPolicy", "label": "Security Policy", "type": "text", "default": ""},
        ],
    },
    "pilot-agreement": {
        "name": "Pilot Agreement",
        "filename": "Pilot-Agreement.md",
        "description": "Standard Pilot Agreement for trial or evaluation access to a product.",
        "parties": ["Provider", "Customer"],
        "fields": [
            {"name": "provider", "label": "Provider Company", "type": "text", "default": ""},
            {"name": "customer", "label": "Customer Company", "type": "text", "default": ""},
            {"name": "effectiveDate", "label": "Effective Date", "type": "date", "default": ""},
            {"name": "pilotPeriod", "label": "Pilot Period", "type": "text", "default": ""},
            {"name": "generalCapAmount", "label": "General Cap Amount", "type": "text", "default": ""},
            {"name": "governingLaw", "label": "Governing Law", "type": "text", "default": ""},
            {"name": "chosenCourts", "label": "Chosen Courts", "type": "text", "default": ""},
            {"name": "noticeAddress", "label": "Notice Address", "type": "text", "default": ""},
        ],
    },
    "design-partner": {
        "name": "Design Partner Agreement",
        "filename": "Design-Partner-Agreement.md",
        "description": "Standard Design Partner Agreement for early product access programs.",
        "parties": ["Provider", "Partner"],
        "fields": [
            {"name": "provider", "label": "Provider Company", "type": "text", "default": ""},
            {"name": "partner", "label": "Partner Company", "type": "text", "default": ""},
            {"name": "effectiveDate", "label": "Effective Date", "type": "date", "default": ""},
            {"name": "term", "label": "Term", "type": "text", "default": ""},
            {"name": "program", "label": "Program Description", "type": "textarea", "default": ""},
            {"name": "fees", "label": "Fees", "type": "text", "default": ""},
            {"name": "governingLaw", "label": "Governing Law", "type": "text", "default": ""},
            {"name": "chosenCourts", "label": "Chosen Courts", "type": "text", "default": ""},
            {"name": "noticeAddress", "label": "Notice Address", "type": "text", "default": ""},
        ],
    },
    "sla": {
        "name": "Service Level Agreement",
        "filename": "SLA.md",
        "description": "Standard SLA covering uptime targets, service credits, and support response times.",
        "parties": ["Provider", "Customer"],
        "fields": [
            {"name": "provider", "label": "Provider Company", "type": "text", "default": ""},
            {"name": "customer", "label": "Customer Company", "type": "text", "default": ""},
            {"name": "targetUptime", "label": "Target Uptime (%)", "type": "text", "default": "99.9%"},
            {"name": "subscriptionPeriod", "label": "Subscription Period", "type": "text", "default": ""},
            {"name": "targetResponseTime", "label": "Target Response Time", "type": "text", "default": ""},
            {"name": "supportChannel", "label": "Support Channel", "type": "text", "default": ""},
            {"name": "uptimeCredit", "label": "Uptime Credit", "type": "text", "default": ""},
            {"name": "responseTimeCredit", "label": "Response Time Credit", "type": "text", "default": ""},
            {"name": "scheduledDowntime", "label": "Scheduled Downtime", "type": "textarea", "default": ""},
        ],
    },
    "psa": {
        "name": "Professional Services Agreement",
        "filename": "PSA.md",
        "description": "Standard PSA covering consulting engagements, statements of work, and deliverables.",
        "parties": ["Provider", "Customer"],
        "fields": [
            {"name": "provider", "label": "Provider Company", "type": "text", "default": ""},
            {"name": "customer", "label": "Customer Company", "type": "text", "default": ""},
            {"name": "effectiveDate", "label": "Effective Date", "type": "date", "default": ""},
            {"name": "generalCapAmount", "label": "General Cap Amount", "type": "text", "default": ""},
            {"name": "governingLaw", "label": "Governing Law", "type": "text", "default": ""},
            {"name": "chosenCourts", "label": "Chosen Courts", "type": "text", "default": ""},
            {"name": "deliverables", "label": "Deliverables", "type": "textarea", "default": ""},
            {"name": "fees", "label": "Fees", "type": "text", "default": ""},
            {"name": "sowTerm", "label": "SOW Term", "type": "text", "default": ""},
        ],
    },
    "partnership": {
        "name": "Partnership Agreement",
        "filename": "Partnership-Agreement.md",
        "description": "Standard Partnership Agreement covering mutual obligations, IP, and revenue sharing.",
        "parties": ["Company", "Partner"],
        "fields": [
            {"name": "company", "label": "Company Name", "type": "text", "default": ""},
            {"name": "partner", "label": "Partner Name", "type": "text", "default": ""},
            {"name": "effectiveDate", "label": "Effective Date", "type": "date", "default": ""},
            {"name": "endDate", "label": "End Date", "type": "date", "default": ""},
            {"name": "obligations", "label": "Obligations", "type": "textarea", "default": ""},
            {"name": "paymentProcess", "label": "Payment Process", "type": "text", "default": ""},
            {"name": "paymentSchedule", "label": "Payment Schedule", "type": "text", "default": ""},
            {"name": "territory", "label": "Territory", "type": "text", "default": ""},
            {"name": "generalCapAmount", "label": "General Cap Amount", "type": "text", "default": ""},
            {"name": "governingLaw", "label": "Governing Law", "type": "text", "default": ""},
            {"name": "chosenCourts", "label": "Chosen Courts", "type": "text", "default": ""},
        ],
    },
    "software-license": {
        "name": "Software License Agreement",
        "filename": "Software-License-Agreement.md",
        "description": "Standard Software License Agreement for on-premises or installed software.",
        "parties": ["Provider", "Customer"],
        "fields": [
            {"name": "provider", "label": "Provider Company", "type": "text", "default": ""},
            {"name": "customer", "label": "Customer Company", "type": "text", "default": ""},
            {"name": "effectiveDate", "label": "Effective Date", "type": "date", "default": ""},
            {"name": "licenseLimits", "label": "License Limits", "type": "textarea", "default": ""},
            {"name": "subscriptionPeriod", "label": "Subscription Period", "type": "text", "default": ""},
            {"name": "paymentProcess", "label": "Payment Process", "type": "text", "default": ""},
            {"name": "generalCapAmount", "label": "General Cap Amount", "type": "text", "default": ""},
            {"name": "governingLaw", "label": "Governing Law", "type": "text", "default": ""},
            {"name": "warrantyPeriod", "label": "Warranty Period", "type": "text", "default": ""},
        ],
    },
    "dpa": {
        "name": "Data Processing Agreement",
        "filename": "DPA.md",
        "description": "Standard DPA governing processing of personal data and data protection compliance.",
        "parties": ["Provider", "Customer"],
        "fields": [
            {"name": "provider", "label": "Provider (Processor)", "type": "text", "default": ""},
            {"name": "customer", "label": "Customer (Controller)", "type": "text", "default": ""},
            {"name": "categoriesOfPersonalData", "label": "Categories of Personal Data", "type": "textarea", "default": ""},
            {"name": "categoriesOfDataSubjects", "label": "Categories of Data Subjects", "type": "textarea", "default": ""},
            {"name": "natureAndPurpose", "label": "Nature and Purpose of Processing", "type": "textarea", "default": ""},
            {"name": "durationOfProcessing", "label": "Duration of Processing", "type": "text", "default": ""},
            {"name": "approvedSubprocessors", "label": "Approved Subprocessors", "type": "textarea", "default": ""},
            {"name": "securityPolicy", "label": "Security Policy", "type": "text", "default": ""},
            {"name": "providerSecurityContact", "label": "Provider Security Contact", "type": "text", "default": ""},
        ],
    },
    "baa": {
        "name": "Business Associate Agreement",
        "filename": "BAA.md",
        "description": "Standard BAA for HIPAA compliance governing use and disclosure of PHI.",
        "parties": ["Provider", "Company"],
        "fields": [
            {"name": "provider", "label": "Provider (Business Associate)", "type": "text", "default": ""},
            {"name": "company", "label": "Company (Covered Entity)", "type": "text", "default": ""},
            {"name": "baaEffectiveDate", "label": "BAA Effective Date", "type": "date", "default": ""},
            {"name": "agreement", "label": "Underlying Agreement Reference", "type": "text", "default": ""},
            {"name": "breachNotificationPeriod", "label": "Breach Notification Period", "type": "text", "default": ""},
            {"name": "limitations", "label": "Limitations", "type": "textarea", "default": ""},
        ],
    },
    "ai-addendum": {
        "name": "AI Addendum",
        "filename": "AI-Addendum.md",
        "description": "Standard AI Addendum covering AI services, training data, and AI-specific warranties.",
        "parties": ["Provider", "Customer"],
        "fields": [
            {"name": "provider", "label": "Provider Company", "type": "text", "default": ""},
            {"name": "customer", "label": "Customer Company", "type": "text", "default": ""},
            {"name": "trainingData", "label": "Training Data", "type": "textarea", "default": ""},
            {"name": "trainingPurposes", "label": "Training Purposes", "type": "textarea", "default": ""},
            {"name": "trainingRestrictions", "label": "Training Restrictions", "type": "textarea", "default": ""},
            {"name": "improvementRestrictions", "label": "Improvement Restrictions", "type": "textarea", "default": ""},
        ],
    },
}


def get_document_types() -> list[dict]:
    """Return list of document types for the frontend dropdown."""
    return [
        {"slug": slug, "name": doc["name"], "description": doc["description"]}
        for slug, doc in DOCUMENT_REGISTRY.items()
    ]


def get_document(slug: str) -> dict | None:
    return DOCUMENT_REGISTRY.get(slug)


def get_field_names_for_prompt(slug: str) -> str:
    """Build a field list string for the AI system prompt."""
    doc = DOCUMENT_REGISTRY.get(slug)
    if not doc:
        return ""
    lines = []
    for f in doc["fields"]:
        default = f" (default: {f['default']})" if f["default"] else ""
        lines.append(f"- {f['name']}: {f['label']}{default}")
    return "\n".join(lines)
