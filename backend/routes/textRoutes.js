const express = require('express');
const {
  generateProposal,
  generateEmail,
  generateIdeas,
} = require('../services/geminiService');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireFields } = require('../utils/validators');

const router = express.Router();

router.post('/generate-proposal', asyncHandler(async (req, res) => {
  requireFields(req.body, ['clientName', 'offer', 'tone', 'clientNotes']);

  const proposal = await generateProposal(req.body);
  res.json({ proposal });
}));

router.post('/generate-email', asyncHandler(async (req, res) => {
  requireFields(req.body, ['objective', 'audience', 'tone', 'context']);

  const email = await generateEmail(req.body);
  res.json({ email });
}));

router.post('/generate-ideas', asyncHandler(async (req, res) => {
  requireFields(req.body, ['industry', 'objective']);

  const ideas = await generateIdeas(req.body);
  res.json({ ideas });
}));

module.exports = router;
