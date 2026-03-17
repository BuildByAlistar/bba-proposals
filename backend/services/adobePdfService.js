const fs = require('fs');
const path = require('path');
const { HttpError } = require('../utils/httpError');

const getAdobeConfig = () => ({
  clientId: process.env.ADOBE_CLIENT_ID,
  clientSecret: process.env.ADOBE_CLIENT_SECRET,
  orgId: process.env.ADOBE_ORG_ID,
  accountId: process.env.ADOBE_ACCOUNT_ID,
  templatePath: process.env.ADOBE_PDF_TEMPLATE_PATH || './templates/proposal-template.docx',
});

const getMissingAdobeEnv = (config) => {
  const envMap = {
    clientId: 'ADOBE_CLIENT_ID',
    clientSecret: 'ADOBE_CLIENT_SECRET',
    orgId: 'ADOBE_ORG_ID',
    accountId: 'ADOBE_ACCOUNT_ID',
  };

  return Object.entries(envMap)
    .filter(([key]) => !config[key])
    .map(([, envName]) => envName);
};

const asText = (value) => (typeof value === 'string' ? value : '');

const normalizeProposalPayload = (payload = {}) => {
  const sections = payload.sections && typeof payload.sections === 'object' ? payload.sections : {};

  return {
    brandName: asText(payload.brandName) || 'BuildByAlistar Agency OS',
    title: asText(payload.title) || 'Client Proposal',
    clientName: asText(payload.clientName),
    clientSummary: asText(payload.clientSummary || payload.executiveSummary || sections.executiveSummary),
    problem: asText(payload.problem || sections.problem),
    solution: asText(payload.solution || sections.solution),
    scope: asText(payload.scope || sections.scope),
    timeline: asText(payload.timeline || sections.timeline),
    pricing: asText(payload.pricing || sections.pricing),
    nextSteps: asText(payload.nextSteps || sections.nextSteps),
  };
};

const buildProposalMergeData = (payload) => {
  const normalized = normalizeProposalPayload(payload);

  return {
    generatedAt: new Date().toISOString(),
    clientName: normalized.clientName,
    title: normalized.title,
    brandName: normalized.brandName,
    clientSummary: normalized.clientSummary,
    problem: normalized.problem,
    solution: normalized.solution,
    scope: normalized.scope,
    timeline: normalized.timeline,
    pricing: normalized.pricing,
    nextSteps: normalized.nextSteps,
  };
};

const getAdobeAccessToken = async (config) => {
  const tokenUrl = 'https://ims-na1.adobelogin.com/ims/token/v3';
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'client_credentials',
    scope: 'openid,AdobeID,read_organizations,additional_info.projectedProductContext,PDFServicesSDK',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new HttpError(502, 'Failed to get Adobe access token.', { reason: text });
  }

  const json = await response.json();
  return json.access_token;
};

const escapePdfText = (value = '') => value
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const toPdfLines = (payload) => {
  const normalized = normalizeProposalPayload(payload);
  const rows = [
    normalized.brandName,
    normalized.title,
    `Prepared for: ${normalized.clientName || 'N/A'}`,
    '',
    'Client Summary',
    normalized.clientSummary,
    '',
    'Problem',
    normalized.problem,
    '',
    'Solution',
    normalized.solution,
    '',
    'Scope',
    normalized.scope,
    '',
    'Timeline',
    normalized.timeline,
    '',
    'Pricing',
    normalized.pricing,
    '',
    'Next Steps',
    normalized.nextSteps,
  ];

  return rows
    .join('\n')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line, index, arr) => line || (arr[index - 1] && arr[index - 1] !== ''))
    .slice(0, 90);
};

const generateFallbackPdf = async (payload) => {
  const lines = toPdfLines(payload);
  const contentLines = ['BT', '/F1 11 Tf', '50 790 Td', '14 TL'];

  lines.forEach((line, index) => {
    const command = `(${escapePdfText(line || ' ')}) Tj`;
    contentLines.push(index === 0 ? command : `T* ${command}`);
  });

  contentLines.push('ET');
  const streamData = `${contentLines.join('\n')}\n`;

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(streamData, 'utf8')} >>\nstream\n${streamData}endstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
};

const generateProposalPdf = async (payload) => {
  const normalized = normalizeProposalPayload(payload);
  if (!normalized.clientName) {
    throw new HttpError(400, 'clientName is required.');
  }

  const config = getAdobeConfig();
  const missing = getMissingAdobeEnv(config);
  const templatePath = path.resolve(process.cwd(), config.templatePath);

  if (missing.length > 0 || !fs.existsSync(templatePath)) {
    return generateFallbackPdf(normalized);
  }

  const token = await getAdobeAccessToken(config);
  const mergeData = buildProposalMergeData(normalized);

  const formData = new FormData();
  formData.append('template', new Blob([fs.readFileSync(templatePath)]), 'proposal-template.docx');
  formData.append('data', new Blob([JSON.stringify(mergeData)], { type: 'application/json' }), 'data.json');

  const response = await fetch('https://pdf-services.adobe.io/operation/documentgeneration', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-key': config.clientId,
    },
    body: formData,
  });

  if (!response.ok) {
    return generateFallbackPdf(normalized);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

module.exports = {
  generateProposalPdf,
  buildProposalMergeData,
  normalizeProposalPayload,
};
