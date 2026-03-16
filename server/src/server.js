import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import generationRoutes from './routes/generationRoutes.js';
import { config } from './config.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', generationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(config.port, () => {
  console.log(`Agency OS API listening on http://localhost:${config.port}`);
});
