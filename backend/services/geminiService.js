const { HttpError } = require('../utils/httpError');

const getGeminiApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new HttpError(500, 'Gemini API key is missing. Set GEMINI_API_KEY in backend/.env.');
  }
  return apiKey;
};

const callGeminiText = async (prompt, modelName) => {
  const apiKey = getGeminiApiKey();

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const isModelIssue = /model|unsupported|not found|404|INVALID_ARGUMENT/i.test(errorText);

    throw new HttpError(
      502,
      isModelIssue
        ? `Gemini model is invalid or unsupported (${modelName}). Update GEMINI_TEXT_MODEL/GEMINI_IMAGE_MODEL in .env.`
        : 'Failed to generate content with Gemini.',
      { provider: 'gemini', reason: errorText }
    );
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!text) {
    throw new HttpError(502, 'Gemini returned an empty response.');
  }

  return text;
};

const buildProposalPrompt = ({ clientName, offer, tone, clientNotes }) => `You are a senior agency strategist writing a sales proposal.
Return polished markdown with clear headings and these sections:
1) Executive Summary
2) Problem
3) Solution
4) Scope
5) Timeline
6) Pricing
7) Next Steps

Business context:
- Client Name: ${clientName}
- Offer: ${offer}
- Tone: ${tone}
- Client Notes: ${clientNotes}

Constraints:
- Keep language business-focused and concrete.
- Include measurable outcomes where possible.
- Be concise and persuasive.`;

const buildEmailPrompt = ({ objective, audience, tone, context }) => `You are an expert agency account director.
Write one outreach email with:
- Subject line
- Body (max 180 words)

Inputs:
- Objective: ${objective}
- Audience: ${audience}
- Tone: ${tone}
- Context: ${context}

Output format:
Subject: ...
Body:
...`;

const buildIdeasPrompt = ({ industry, objective }) => `You are a growth strategist for agencies.
Generate 10 practical campaign/content ideas.

Inputs:
- Industry: ${industry}
- Objective: ${objective}

Output as a numbered list.
Each idea should include:
- Title
- Why it works
- Suggested format/channel`;

const buildImageConceptPrompt = ({ prompt, brandName, platform }) => `You are a creative director for ${brandName}.
Create a strong social image concept for ${platform}.

Prompt seed:
${prompt}

Return:
- Creative direction
- Visual style
- Composition notes
- Color palette
- Typography guidance
- CTA overlay text suggestion`;

const generateProposal = async (input) => {
  const modelName = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash';
  return callGeminiText(buildProposalPrompt(input), modelName);
};

const generateEmail = async (input) => {
  const modelName = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash';
  return callGeminiText(buildEmailPrompt(input), modelName);
};

const generateIdeas = async (input) => {
  const modelName = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash';
  return callGeminiText(buildIdeasPrompt(input), modelName);
};

const generateImageConcept = async (input) => {
  const modelName = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash';
  return callGeminiText(buildImageConceptPrompt(input), modelName);
};

const generateImage = async ({ prompt, brandName, platform }) => {
  const modelName = process.env.GEMINI_IMAGE_MODEL;
  if (!modelName) {
    return {
      status: 'not_configured',
      message: 'Gemini image model is not configured. Set GEMINI_IMAGE_MODEL to enable image generation.',
    };
  }

  try {
    const apiKey = getGeminiApiKey();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate a marketing image for ${brandName} on ${platform}. ${prompt}` }] }],
      }),
    });

    if (!response.ok) {
      return {
        status: 'not_configured',
        message: 'Gemini image generation is not configured for the current model or API permission.',
      };
    }

    const json = await response.json();
    const parts = json?.candidates?.[0]?.content?.parts || [];
    const inlineImagePart = parts.find((part) => part.inlineData?.data);

    if (!inlineImagePart) {
      return {
        status: 'not_configured',
        message:
          'Direct Gemini image binary output is not available in this runtime/model yet. Endpoint is ready for future support.',
      };
    }

    return {
      status: 'ok',
      mimeType: inlineImagePart.inlineData.mimeType,
      imageBase64: inlineImagePart.inlineData.data,
    };
  } catch (_error) {
    return {
      status: 'not_configured',
      message: 'Gemini image generation is not configured for the current SDK/runtime.',
    };
  }
};

module.exports = {
  generateProposal,
  generateEmail,
  generateIdeas,
  generateImageConcept,
  generateImage,
};
