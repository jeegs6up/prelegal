"""AI chat for Mutual NDA field extraction."""

import os
from typing import Optional

from dotenv import load_dotenv
from litellm import completion
from pydantic import BaseModel

load_dotenv()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a friendly legal assistant helping a user create a Mutual Non-Disclosure Agreement (NDA).

Your job is to have a natural conversation to gather the information needed for the NDA. Ask about one or two fields at a time, in a conversational way.

The fields you need to gather are:
- purpose: How the confidential information may be used (default: "Evaluating whether to enter into a business relationship with the other party.")
- effectiveDate: When the NDA takes effect (default: today's date)
- mndaTermType: "expires" or "perpetual" (default: expires)
- mndaTermYears: Number of years if expires (default: "1")
- confidentialityTermType: "expires" or "perpetual" (default: expires)
- confidentialityTermYears: Number of years if expires (default: "1")
- governingLaw: The state whose laws govern (e.g. "Delaware")
- jurisdiction: Where disputes are resolved (e.g. "courts located in New Castle, DE")
- modifications: Any modifications to standard terms (optional)
- party1: { name, title, company, noticeAddress }
- party2: { name, title, company, noticeAddress }

Guidelines:
- Be concise and conversational, not robotic
- Ask about the most important fields first: the parties involved, then purpose, then legal details
- When the user provides information, acknowledge it and move to the next field
- If the user seems unsure, suggest sensible defaults
- When all key fields are gathered (both parties' company names, governing law, jurisdiction), let the user know the NDA looks complete and suggest they review the preview
- Always ask a follow-up question if there are still unfilled fields
"""

GREETING = (
    "Hi! I'll help you create a Mutual NDA. "
    "Let's start with the basics — who are the two parties involved? "
    "Please tell me the company names for both sides."
)


class PartyFields(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    noticeAddress: Optional[str] = None


class NdaExtractedFields(BaseModel):
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[str] = None
    mndaTermYears: Optional[str] = None
    confidentialityTermType: Optional[str] = None
    confidentialityTermYears: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    modifications: Optional[str] = None
    party1: Optional[PartyFields] = None
    party2: Optional[PartyFields] = None


class ChatResponse(BaseModel):
    message: str
    fields: NdaExtractedFields


EXTRACTION_PROMPT = """Based on the conversation so far, extract any NDA fields that the user has provided.
Also provide your conversational response to the user.

Return a JSON object with:
- "message": your conversational response to the user
- "fields": an object with any fields you can extract from the conversation. Only include fields that have been explicitly mentioned. Use null for fields not yet discussed.

For party1 and party2, include sub-fields: name, title, company, noticeAddress. Use null for sub-fields not provided."""


def get_greeting() -> str:
    return GREETING


def chat(messages: list[dict], current_fields: dict) -> ChatResponse:
    """Process a chat message and extract NDA fields."""
    system_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Current NDA fields already filled in: {current_fields}"},
        {"role": "system", "content": EXTRACTION_PROMPT},
    ]

    response = completion(
        model=MODEL,
        messages=system_messages + messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )

    try:
        result = response.choices[0].message.content
        return ChatResponse.model_validate_json(result)
    except Exception:
        return ChatResponse(
            message="I'm sorry, I had trouble processing that. Could you try rephrasing?",
            fields=NdaExtractedFields(),
        )
