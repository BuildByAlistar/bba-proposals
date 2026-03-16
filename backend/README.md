# Agency OS Backend

Production-style Node.js + Express backend for 3 core features:
1. Gemini text generation
2. Adobe document-generation-based proposal PDF export
3. Gemini image concept + image endpoint scaffold

## Folder structure

```txt
backend/
  server.js
  package.json
  .env.example
  routes/
  services/
  templates/
  utils/
```

## 1) Install

```bash
cd backend
npm install
```

## 2) Environment setup

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required variables:

```env
PORT=5000
GEMINI_API_KEY=
GEMINI_TEXT_MODEL=gemini-2.0-flash
GEMINI_IMAGE_MODEL=gemini-2.0-flash-preview-image-generation
ADOBE_CLIENT_ID=
ADOBE_CLIENT_SECRET=
ADOBE_ORG_ID=
ADOBE_ACCOUNT_ID=
ADOBE_PRIVATE_KEY=
ADOBE_PDF_TEMPLATE_PATH=./templates/proposal-template.docx
```

## 3) Run

```bash
npm run dev
# or
npm start
```

Default server URL: `http://localhost:5000`

## 4) API endpoints

### Health
- `GET /health` → `{ "status": "ok" }`

### Gemini text generation
- `POST /generate-proposal`
- `POST /generate-email`
- `POST /generate-ideas`

Example:

```bash
curl -X POST http://localhost:5000/generate-ideas \
  -H 'Content-Type: application/json' \
  -d '{"industry":"real estate","objective":"generate local seller leads"}'
```

### Gemini image
- `POST /generate-image-concept`
- `POST /generate-image`

If runtime/model does not support direct image binary output yet, `/generate-image` returns a safe `not_configured` response instead of crashing.

### Adobe PDF export (DOCX template merge)
- `POST /export-proposal-pdf`

Example:

```bash
curl -X POST http://localhost:5000/export-proposal-pdf \
  -H 'Content-Type: application/json' \
  -d '{
    "clientName":"Acme Inc",
    "offer":"Lead Generation Retainer",
    "tone":"consultative",
    "proposalText":"High-level proposal text",
    "sections":{
      "executiveSummary":"Summary",
      "problem":"Problem",
      "solution":"Solution",
      "scope":"Scope",
      "timeline":"Timeline",
      "pricing":"Pricing",
      "nextSteps":"Next steps"
    }
  }' --output proposal.pdf
```

## Adobe credentials setup

Use Adobe PDF Services credentials in `.env`:
- `ADOBE_CLIENT_ID`
- `ADOBE_CLIENT_SECRET`
- `ADOBE_ORG_ID`
- `ADOBE_ACCOUNT_ID`
- `ADOBE_PRIVATE_KEY` (single line or `\n` escaped multiline key)

## DOCX template placement

Place your Adobe merge template at:
- `backend/templates/proposal-template.docx`

or change `ADOBE_PDF_TEMPLATE_PATH`.

## Template tag mapping reference (sample)

Use tags in DOCX such as:
- `{{clientName}}`
- `{{offer}}`
- `{{tone}}`
- `{{proposalText}}`
- `{{sections.executiveSummary}}`
- `{{sections.problem}}`
- `{{sections.solution}}`
- `{{sections.scope}}`
- `{{sections.timeline}}`
- `{{sections.pricing}}`
- `{{sections.nextSteps}}`

### Sample JSON merge data shape

```json
{
  "generatedAt": "2026-03-16T00:00:00.000Z",
  "clientName": "Acme Inc",
  "offer": "Lead Generation Retainer",
  "tone": "consultative",
  "proposalText": "High-level proposal text",
  "sections": {
    "executiveSummary": "Summary",
    "problem": "Problem",
    "solution": "Solution",
    "scope": "Scope",
    "timeline": "Timeline",
    "pricing": "Pricing",
    "nextSteps": "Next steps"
  }
}
```
