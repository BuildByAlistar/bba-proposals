// Legacy module kept for backward compatibility.
// Gemini direct API usage has been removed in favor of Vertex AI.

const {
  generateProposal,
  generateEmail,
  generateIdeas,
} = require('./services/vertexAiService');

async function generateText(prompt) {
  return generateIdeas({ industry: 'general', objective: prompt });
}

module.exports = {
  generateText,
  generateProposal,
  generateEmail,
  generateIdeas,
};
