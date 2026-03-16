const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const textRoutes = require('./routes/textRoutes');
const imageRoutes = require('./routes/imageRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const { notFoundHandler, errorHandler } = require('./utils/errorHandlers');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', textRoutes);
app.use('/', imageRoutes);
app.use('/', pdfRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[startup] Agency OS backend listening on port ${PORT}`);
  console.log(`[startup] Text model: ${process.env.GEMINI_TEXT_MODEL || 'not set'}`);
  console.log(`[startup] Image model: ${process.env.GEMINI_IMAGE_MODEL || 'not set'}`);
});
