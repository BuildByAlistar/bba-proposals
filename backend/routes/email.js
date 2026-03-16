const express = require('express');
const { generateProposal, generateEmail, generateIdeas } = require('../services/vertexAiService');

const router = express.Router();

router.post('/generate-email', async (req, res) => {
  try {
    const { recipientName, companyName, purpose, context, callToAction, tone } = req.body;

    if (!purpose) {
      return res.status(400).json({ error: 'purpose is required.' });
    }

    const prompt = `Write a concise, high-converting agency email.

Recipient Name: ${recipientName || 'there'}
Company Name: ${companyName || 'their company'}
Purpose: ${purpose}
Context: ${context || 'No additional context provided'}
Call to Action: ${callToAction || 'Suggest a short intro call'}
Tone: ${tone || 'Professional and friendly'}

Return:
- Subject line
- Email body`;

    const email = await generateEmail({ objective: purpose, audience: `${recipientName || 'there'} at ${companyName || 'their company'}`, tone: tone || 'Professional and friendly', context: `${context || 'No additional context provided'}\nCall to Action: ${callToAction || 'Suggest a short intro call'}` });
    return res.json({ email });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to generate email.',
      details: error.message
    });
  }
});

module.exports = router;
