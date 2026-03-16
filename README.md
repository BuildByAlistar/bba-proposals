# BuildByAlistar Agency OS (Internal)

Private internal Agency OS for proposal and content operations.

## Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Gemini API (text/image/video scaffolding)
- **Export:** Puppeteer PDF generation

## MVP Included
- Dashboard
- Proposal Builder
- Email Draft Generator
- Ideas Generator
- PDF Export from proposal draft

## API Endpoints
- `POST /generate-proposal`
- `POST /generate-email`
- `POST /generate-ideas`
- `POST /generate-image`
- `POST /generate-video-script`
- `POST /generate-video`
- `POST /export-pdf`

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Set Gemini key:
   ```bash
   export GEMINI_API_KEY=your_key_here
   ```
3. Run frontend + backend:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173` and API on `http://localhost:8787`.

## Notes
- If `GEMINI_API_KEY` is not set, text endpoints use a fallback response for offline development.
- `/generate-video` is intentionally scaffolded (`501`) for future video generation support.
