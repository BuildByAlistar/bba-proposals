# BuildByAlistar Agency OS (Internal MVP)

Internal-use Agency OS MVP with a React frontend and Node.js/Express backend.

## Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI generation:** Gemini API
- **PDF export:** Puppeteer (branded HTML to PDF)

## Backend API Routes (MVP)
- `POST /generate-proposal`
- `POST /generate-email`
- `POST /generate-ideas`
- `POST /export-pdf`

## Proposal Output Contract
`POST /generate-proposal` is prompted to always return these sections in order:
1. Client Summary
2. Problem
3. Solution
4. Scope
5. Timeline
6. Pricing
7. Next Steps

## Frontend Coverage
Connected UI pages:
- Proposal Builder → `/generate-proposal` + `/export-pdf`
- Email Draft Generator → `/generate-email`
- Ideas Generator → `/generate-ideas`

Placeholder-only pages (intentionally no active backend integration in MVP):
- Media Lab
- Video

## Environment Variables
Create a `.env` file in the project root:

```bash
PORT=8787
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
VITE_API_BASE_URL=http://localhost:8787
```

Notes:
- `GEMINI_API_KEY` is optional for local development. If not set, text endpoints return a clear offline fallback message.
- No authentication is enabled (internal-use only, per MVP scope).

## Run Instructions
Install dependencies:

```bash
npm install
```

Run backend API:

```bash
npm run start:server
```

Run frontend (separate terminal):

```bash
npm run dev
```

Open app at `http://localhost:5173`.

## Build Check
```bash
npm run build
```
