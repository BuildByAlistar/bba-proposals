const fs = require('fs');
const path = require('path');
const http = require('http');

const {
  generateProposal,
  generateEmail,
  generateIdeas,
  generateImageConcept,
  generateImage,
} = require('./services/vertexAiService');
const { generateProposalPdf } = require('./services/adobePdfService');
const { requireFields } = require('./utils/validators');
const { HttpError } = require('./utils/httpError');

const loadEnvFile = (envPath) => {
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadEnvFile(path.resolve(__dirname, '.env'));

const PORT = Number(process.env.PORT) || 5000;

const json = (res, statusCode, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(body);
};

const parseBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (_error) {
    throw new HttpError(400, 'Invalid JSON body.');
  }
};

const handleError = (res, error) => {
  if (error instanceof HttpError) {
    return json(res, error.statusCode, { error: error.message, details: error.details || undefined });
  }

  return json(res, 500, { error: 'Internal server error.', details: error?.message || String(error) });
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    });
    return res.end();
  }

  try {
    if (req.method === 'GET' && req.url === '/health') {
      return json(res, 200, { status: 'ok' });
    }

    if (req.method === 'POST' && req.url === '/generate-proposal') {
      const body = await parseBody(req);
      requireFields(body, ['clientName', 'offer', 'tone', 'clientNotes']);
      const proposal = await generateProposal(body);
      return json(res, 200, { proposal });
    }

    if (req.method === 'POST' && req.url === '/generate-email') {
      const body = await parseBody(req);
      requireFields(body, ['objective', 'audience', 'tone', 'context']);
      const email = await generateEmail(body);
      return json(res, 200, { email });
    }

    if (req.method === 'POST' && req.url === '/generate-ideas') {
      const body = await parseBody(req);
      requireFields(body, ['industry', 'objective']);
      const ideas = await generateIdeas(body);
      return json(res, 200, { ideas });
    }

    if (req.method === 'POST' && req.url === '/generate-image-concept') {
      const body = await parseBody(req);
      requireFields(body, ['prompt']);
      const concept = await generateImageConcept({
        prompt: body.prompt,
        brandName: body.brandName || 'BuildByAlistar',
        platform: body.platform || 'instagram',
      });
      return json(res, 200, { concept });
    }

    if (req.method === 'POST' && req.url === '/generate-image') {
      const body = await parseBody(req);
      requireFields(body, ['prompt']);
      const imageResult = await generateImage({
        prompt: body.prompt,
        brandName: body.brandName || 'BuildByAlistar',
        platform: body.platform || 'instagram',
      });
      return json(res, 200, imageResult);
    }

    if (req.method === 'POST' && req.url === '/export-pdf') {
      const body = await parseBody(req);
      requireFields(body, ['title', 'clientName']);

      const pdfBuffer = await generateProposalPdf(body);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="proposal.pdf"',
        'Access-Control-Allow-Origin': '*',
      });
      return res.end(pdfBuffer);
    }

    return json(res, 404, { error: 'Route not found.' });
  } catch (error) {
    return handleError(res, error);
  }
});

server.listen(PORT, () => {
  console.log(`[startup] Agency OS backend listening on port ${PORT}`);
  console.log(`[startup] Vertex text model: ${process.env.VERTEX_TEXT_MODEL || 'not set'}`);
  console.log(`[startup] Vertex image model: ${process.env.VERTEX_IMAGE_MODEL || 'not set'}`);
});
