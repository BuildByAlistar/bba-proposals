# Agency OS Backend

Node.js + Express backend for:
1. Vertex AI text generation
2. Vertex AI image concept/image generation
3. Adobe document-generation proposal PDF export

## Local setup

```bash
cd backend
npm install
cp .env.example .env
```

Use this `.env` (already provisioned in this repo):

```env
PORT=5000
GOOGLE_CLOUD_PROJECT=buildbystar-a109d
GOOGLE_CLOUD_LOCATION=global
GOOGLE_APPLICATION_CREDENTIALS=./vertex-key.json
VERTEX_TEXT_MODEL=gemini-2.5-flash
VERTEX_IMAGE_MODEL=gemini-2.5-flash-image
ADOBE_CLIENT_ID=
ADOBE_CLIENT_SECRET=
ADOBE_ORG_ID=
ADOBE_ACCOUNT_ID=
ADOBE_PDF_TEMPLATE_PATH=./templates/proposal-template.docx
```

> `GOOGLE_APPLICATION_CREDENTIALS` points to `./vertex-key.json` in `backend/`.

## Run locally

```bash
cd backend
node server.js
```

Server runs at: `http://localhost:5000`

Startup logs show:
- Vertex text model
- Vertex image model

## API endpoints

- `GET /health`
- `POST /generate-proposal`
- `POST /generate-email`
- `POST /generate-ideas`
- `POST /generate-image-concept`
- `POST /generate-image`
- `POST /export-proposal-pdf`

## Curl test examples

Health check:

```bash
curl -s http://localhost:5000/health
```

Generate ideas (Vertex AI):

```bash
curl -s -X POST http://localhost:5000/generate-ideas \
  -H 'Content-Type: application/json' \
  -d '{"industry":"real estate","objective":"generate local seller leads"}'
```

## Adobe PDF notes

Set Adobe credentials in `.env`:
- `ADOBE_CLIENT_ID`
- `ADOBE_CLIENT_SECRET`
- `ADOBE_ORG_ID`
- `ADOBE_ACCOUNT_ID`

Place the DOCX template at `backend/templates/proposal-template.docx` (or override `ADOBE_PDF_TEMPLATE_PATH`).
