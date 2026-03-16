const path = require('path');
let VertexAI;
try {
  ({ VertexAI } = require('@google-cloud/vertexai'));
} catch (_error) {
  VertexAI = null;
}
const { HttpError } = require('../utils/httpError');

const DEFAULT_TEXT_MODEL = 'gemini-2.5-flash';
const DEFAULT_IMAGE_MODEL = 'gemini-2.5-flash-image';

let cachedVertexClient;


const ensureVertexSdk = () => {
  if (!VertexAI) {
    throw new HttpError(
      500,
      'Vertex AI SDK is not installed. Add @google-cloud/vertexai to backend dependencies.'
    );
  }
};


const getVertexConfig = () => {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'global';

  if (!project) {
    throw new HttpError(500, 'Vertex AI is not configured. Set GOOGLE_CLOUD_PROJECT in backend/.env.');
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), credentialsPath);
  }

  return { project, location };
};

const getVertexClient = () => {
  if (!cachedVertexClient) {
    ensureVertexSdk();
    const config = getVertexConfig();
    cachedVertexClient = new VertexAI(config);
  }

  return cachedVertexClient;
};

const readTextResponse = (response) => {
  const text = response?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!text) {
    throw new HttpError(502, 'Vertex AI returned an empty text response.');
  }

  return text;
};

const callVertexText = async (prompt, modelName) => {
  try {
    const client = getVertexClient();
    const model = client.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8 },
    });

    return readTextResponse(result.response);
  } catch (error) {
    throw new HttpError(502, `Failed to generate text with Vertex AI model (${modelName}).`, {
      provider: 'vertex-ai',
      reason: error?.message || String(error),
    });
  }
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
  const modelName = process.env.VERTEX_TEXT_MODEL || DEFAULT_TEXT_MODEL;
  return callVertexText(buildProposalPrompt(input), modelName);
};

const generateEmail = async (input) => {
  const modelName = process.env.VERTEX_TEXT_MODEL || DEFAULT_TEXT_MODEL;
  return callVertexText(buildEmailPrompt(input), modelName);
};

const generateIdeas = async (input) => {
  const modelName = process.env.VERTEX_TEXT_MODEL || DEFAULT_TEXT_MODEL;
  return callVertexText(buildIdeasPrompt(input), modelName);
};

const generateImageConcept = async (input) => {
  const modelName = process.env.VERTEX_TEXT_MODEL || DEFAULT_TEXT_MODEL;
  return callVertexText(buildImageConceptPrompt(input), modelName);
};

const generateImage = async ({ prompt, brandName, platform }) => {
  const modelName = process.env.VERTEX_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;

  try {
    const client = getVertexClient();
    const model = client.getGenerativeModel({ model: modelName });
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Generate a marketing image for ${brandName} on ${platform}. ${prompt}` }],
        },
      ],
    });

    const parts = result?.response?.candidates?.[0]?.content?.parts || [];
    const inlineImagePart = parts.find((part) => part.inlineData?.data);

    if (!inlineImagePart) {
      return {
        status: 'not_configured',
        message: 'Vertex image generation did not return inline image data for the current model/runtime.',
      };
    }

    return {
      status: 'ok',
      mimeType: inlineImagePart.inlineData.mimeType,
      imageBase64: inlineImagePart.inlineData.data,
    };
  } catch (error) {
    return {
      status: 'not_configured',
      message: `Vertex image generation is unavailable: ${error?.message || String(error)}`,
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
