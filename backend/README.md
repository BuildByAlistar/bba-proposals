# Agency OS Backend

## Setup

1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

## Run

- Development mode:
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

## API Endpoints

- `POST /generate-proposal`
- `POST /generate-email`
- `POST /generate-ideas`
- `POST /export-pdf`
- `GET /health`
