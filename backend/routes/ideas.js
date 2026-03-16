const express = require('express');
const { generateProposal, generateEmail, generateIdeas } = require('../services/vertexAiService');

const router = express.Router();

router.post('/generate-ideas', async (req, res) => {
  try {
    const { industry, targetAudience, objective, channels, numberOfIdeas } = req.body;

    if (!industry || !objective) {
      return res.status(400).json({
        error: 'industry and objective are required.'
      });
    }

    const prompt = `Generate creative growth ideas for an agency team.

Industry: ${industry}
Target Audience: ${targetAudience || 'Not specified'}
Objective: ${objective}
Preferred Channels: ${channels || 'Any relevant channels'}
Number of ideas requested: ${numberOfIdeas || 10}

For each idea include:
1. Idea title
2. Why it works
3. First step to execute`;

    const ideas = await generateIdeas({ industry, objective });
    return res.json({ ideas });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to generate ideas.',
      details: error.message
    });
  }
});

module.exports = router;
