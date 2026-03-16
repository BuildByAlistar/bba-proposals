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

const ensureAdobeReady = (config) => {
  const envMap = {
    clientId: 'ADOBE_CLIENT_ID',
    clientSecret: 'ADOBE_CLIENT_SECRET',
    orgId: 'ADOBE_ORG_ID',
    accountId: 'ADOBE_ACCOUNT_ID',
  };

  const missing = Object.entries(envMap)
    .filter(([key]) => !config[key])
    .map(([, envName]) => envName);

  if (missing.length > 0) {
    throw new HttpError(
      400,
      'Adobe PDF generation is not configured. Missing required Adobe credentials.',
      { missing }
    );
  }
};

const buildProposalMergeData = (payload) => ({
  generatedAt: new Date().toISOString(),
  clientName: payload.clientName,
  offer: payload.offer,
  tone: payload.tone,
  proposalText: payload.proposalText,
  sections: {
    executiveSummary: payload.sections.executiveSummary,
    problem: payload.sections.problem,
    solution: payload.sections.solution,
    scope: payload.sections.scope,
    timeline: payload.sections.timeline,
    pricing: payload.sections.pricing,
    nextSteps: payload.sections.nextSteps,
  },
});

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

const generateProposalPdf = async (payload) => {
  const config = getAdobeConfig();
  ensureAdobeReady(config);

  const templatePath = path.resolve(process.cwd(), config.templatePath);
  if (!fs.existsSync(templatePath)) {
    throw new HttpError(400, `DOCX template not found at ${templatePath}. Add proposal-template.docx in /backend/templates.`);
  }

  const token = await getAdobeAccessToken(config);
  const mergeData = buildProposalMergeData(payload);

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
    const text = await response.text();
    throw new HttpError(502, 'Adobe PDF generation failed.', { provider: 'adobe', reason: text });
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

module.exports = {
  generateProposalPdf,
  buildProposalMergeData,
};
