const express = require('express');
const { generateProposalPdf } = require('../services/adobePdfService');
const { asyncHandler } = require('../utils/asyncHandler');
const { HttpError } = require('../utils/httpError');
const { requireFields } = require('../utils/validators');

const router = express.Router();

const requiredSectionKeys = [
  'executiveSummary',
  'problem',
  'solution',
  'scope',
  'timeline',
  'pricing',
  'nextSteps',
];

router.post('/export-proposal-pdf', asyncHandler(async (req, res) => {
  requireFields(req.body, ['clientName', 'offer', 'tone', 'proposalText']);

  const sections = req.body.sections;
  if (!sections || typeof sections !== 'object') {
    throw new HttpError(400, 'sections object is required.');
  }

  const missingSections = requiredSectionKeys.filter(
    (key) => typeof sections[key] !== 'string' || sections[key].trim() === ''
  );

  if (missingSections.length > 0) {
    throw new HttpError(400, `Missing required section fields: ${missingSections.join(', ')}`);
  }

  const pdfBuffer = await generateProposalPdf(req.body);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${req.body.clientName || 'proposal'}-proposal.pdf"`);
  res.send(pdfBuffer);
}));

module.exports = router;
