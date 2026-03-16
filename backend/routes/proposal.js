const express = require('express');
const { generateProposal, generateEmail, generateIdeas } = require('../services/vertexAiService');

const router = express.Router();

router.post('/generate-proposal', async (req, res) => {
  try {
    const { projectName, clientName, goals, scope, timeline, budget, tone } = req.body;

    if (!projectName || !clientName) {
      return res.status(400).json({
        error: 'projectName and clientName are required.'
      });
    }

    const prompt = `You are an expert agency strategist. Create a clear, persuasive project proposal.

Project Name: ${projectName}
Client Name: ${clientName}
Goals: ${goals || 'Not provided'}
Scope: ${scope || 'Not provided'}
Timeline: ${timeline || 'Not provided'}
Budget: ${budget || 'Not provided'}
Tone: ${tone || 'Professional'}

Return the proposal in markdown format with these sections:
1. Executive Summary
2. Objectives
3. Scope of Work
4. Timeline & Milestones
5. Budget Overview
6. Next Steps`;

    const proposal = await generateProposal({ clientName, offer: projectName, tone: tone || 'Professional', clientNotes: `Goals: ${goals || 'Not provided'}\nScope: ${scope || 'Not provided'}\nTimeline: ${timeline || 'Not provided'}\nBudget: ${budget || 'Not provided'}` });
    return res.json({ proposal });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to generate proposal.',
      details: error.message
    });
  }
});

module.exports = router;
