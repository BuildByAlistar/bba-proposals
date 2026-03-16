const express = require('express');
const {
  generateImageConcept,
  generateImage,
} = require('../services/vertexAiService');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireFields } = require('../utils/validators');

const router = express.Router();

router.post('/generate-image-concept', asyncHandler(async (req, res) => {
  requireFields(req.body, ['prompt']);

  const payload = {
    prompt: req.body.prompt,
    brandName: req.body.brandName || 'BuildByAlistar',
    platform: req.body.platform || 'instagram',
  };

  const concept = await generateImageConcept(payload);
  res.json({ concept });
}));

router.post('/generate-image', asyncHandler(async (req, res) => {
  requireFields(req.body, ['prompt']);

  const payload = {
    prompt: req.body.prompt,
    brandName: req.body.brandName || 'BuildByAlistar',
    platform: req.body.platform || 'instagram',
  };

  const imageResult = await generateImage(payload);
  res.json(imageResult);
}));

module.exports = router;
