const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const proposalRoutes = require('./routes/proposal');
const emailRoutes = require('./routes/email');
const ideasRoutes = require('./routes/ideas');
const pdfRoutes = require('./routes/pdf');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
