"""AI chat for legal document field extraction."""

from typing import Optional

from dotenv import load_dotenv
from litellm import completion
from pydantic import BaseModel

from documents import get_document, get_field_names_for_prompt

load_dotenv()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT_TEMPLATE = """You are a friendly legal assistant helping a user create a {doc_name}.

{doc_description}

Your job is to have a natural conversation to gather the information needed for this document. Ask about one or two fields at a time, in a conversational way.

The fields you need to gather are:
{field_list}

Guidelines:
- Be concise and conversational, not robotic
- Ask about the most important fields first: the parties involved, then key terms
- When the user provides information, acknowledge it and move to the next field
- If the user seems unsure, suggest sensible defaults
- When all key fields are gathered, let the user know the document looks complete and suggest they review the preview
- Always ask a follow-up question if there are still unfilled fields
"""

GREETING_TEMPLATE = (
    "Hi! I'll help you create a {doc_name}. "
    "Let's start with the basics — who are the parties involved? "
    "Please tell me the company names for both sides."
)

EXTRACTION_PROMPT = """Based on the conversation so far, extract any document fields that the user has provided.
Also provide your conversational response to the user.

IMPORTANT: Look at the "Current fields already filled in" above. Any field that is empty ("") still needs to be gathered. Your message MUST ask about the next 1-2 unfilled fields. Do NOT say the document is complete unless all key fields have non-empty values.

Return a JSON object with:
- "message": your conversational response acknowledging what the user said, FOLLOWED BY a question about the next unfilled field(s)
- "fields": an object with any fields you can extract from the conversation. Only include fields that have been explicitly mentioned. Use null for fields not yet discussed."""


class ChatResponse(BaseModel):
    message: str
    fields: Optional[dict] = None


def get_greeting(doc_type: str) -> str:
    doc = get_document(doc_type)
    if not doc:
        return "Hi! Please select a document type to get started."
    return GREETING_TEMPLATE.format(doc_name=doc["name"])


def chat(messages: list[dict], current_fields: dict, doc_type: str) -> ChatResponse:
    """Process a chat message and extract document fields."""
    doc = get_document(doc_type)
    if not doc:
        return ChatResponse(
            message="Please select a document type first.",
            fields={},
        )

    field_list = get_field_names_for_prompt(doc_type)
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        doc_name=doc["name"],
        doc_description=doc["description"],
        field_list=field_list,
    )

    system_messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content": f"Current fields already filled in: {current_fields}"},
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
            fields={},
        )
