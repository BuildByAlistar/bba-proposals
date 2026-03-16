const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const proposalRoutes = require('./routes/proposal');
const emailRoutes = require('./routes/email');
const ideasRoutes = require('./routes/ideas');
const pdfRoutes = require('./routes/pdf');

const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

if (!fs.existsSync(envPath)) {
  console.warn('Warning: backend/.env file not found. Create one with GEMINI_API_KEY=<your-key>.');
} else if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY missing in backend/.env. AI routes will fail until configured.');
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', proposalRoutes);
app.use('/', emailRoutes);
app.use('/', ideasRoutes);
app.use('/', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Agency OS backend running on port ${PORT}`);
});
