# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
All 11 document types from the catalog are supported via AI chat.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.
The backend should be in backend/ and be a uv project, using FastAPI.
The frontend should be in frontend/
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.
Consider statically building the frontend and serving it via FastAPI, if that will work.
There should be scripts in scripts/ for:
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### Completed (PL-4)
- Docker multi-stage build (Node frontend + Python backend)
- FastAPI backend with SQLite (fresh DB each container start, users table schema ready)
- Next.js static export served by FastAPI at localhost:8000
- Fake login screen (any email/password accepted, localStorage-based)
- Start/stop scripts for Mac, Linux, Windows
- Mutual NDA form with live preview and PDF download
- Project color scheme applied to frontend

### Completed (PL-5)
- AI chat interface alongside manual form for Mutual NDA creation
- Uses LiteLLM via OpenRouter with Cerebras inference (gpt-oss-120b model)
- Structured outputs for reliable field extraction from conversation
- Live preview updates as AI extracts fields from chat
- AI greets user, asks questions conversationally, and confirms when complete
- Layout: left = form + preview, right = chat panel

### Completed (PL-6)
- Support for all 11 document types from catalog.json
- Document type dropdown selector in header
- Document registry (backend/documents.py) with field definitions per document type
- Generic form component renders fields dynamically per document type
- Generic preview component renders markdown templates with field substitution
- NDA keeps its polished custom form and preview components
- AI chat adapts system prompt and field extraction per document type
- Equal-width layout: form+preview left, chat right

### Current API Endpoints
- `GET /api/health` - Health check
- `GET /api/documents/types` - List all document types for dropdown
- `GET /api/documents/template/{slug}` - Get template content and field schema
- `GET /api/chat/greeting?doc_type=` - Get AI greeting for document type
- `POST /api/chat/message` - Send chat message with documentType, get AI response + extracted fields
