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
let cachedVertexConfig;


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
    const resolvedCredentialsPath = path.isAbsolute(credentialsPath)
      ? credentialsPath
      : path.resolve(__dirname, '..', credentialsPath);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedCredentialsPath;
  }

  const endpointHost = location === 'global'
    ? 'aiplatform.googleapis.com'
    : `${location}-aiplatform.googleapis.com`;

  return {
    project,
    location,
    endpoint: `https://${endpointHost}`,
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || null,
  };
};

const getVertexClient = () => {
  if (!cachedVertexClient) {
    ensureVertexSdk();
    const config = getVertexConfig();
    cachedVertexConfig = config;
    cachedVertexClient = new VertexAI({
      project: config.project,
      location: config.location,
    });
  }

  return cachedVertexClient;
};

const parseErrorDetails = (rawText) => {
  if (!rawText) return null;

  try {
    return JSON.parse(rawText);
  } catch (_error) {
    return null;
  }
};

const extractErrorContext = async (error) => {
  const responseLike = error?.response || error?.cause?.response;
  const statusCode =
    responseLike?.status || error?.status || error?.statusCode || error?.code || null;

  let rawBody = null;
  if (typeof responseLike?.text === 'function') {
    try {
      rawBody = await responseLike.text();
    } catch (_err) {
      rawBody = null;
    }
  }

  if (!rawBody && typeof error?.body === 'string') {
    rawBody = error.body;
  }

  const parsedDetails = parseErrorDetails(rawBody) || error?.details || null;
  return {
    statusCode,
    rawBody,
    parsedDetails,
  };
};

const sanitizeJsonText = (text) => text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();

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
  const client = getVertexClient();
  const model = client.getGenerativeModel({ model: modelName });
  const endpoint = `${cachedVertexConfig.endpoint}/v1/projects/${cachedVertexConfig.project}/locations/${cachedVertexConfig.location}/publishers/google/models/${modelName}:generateContent`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8 },
    });

    return readTextResponse(result.response);
  } catch (error) {
    const errorContext = await extractErrorContext(error);
    console.error('[vertex-ai] Text generation failed', {
      endpoint,
      modelName,
      statusCode: errorContext.statusCode,
      rawResponseText: errorContext.rawBody,
      parsedErrorDetails: errorContext.parsedDetails,
      credentialsPath: cachedVertexConfig?.credentialsPath || null,
      reason: error?.message || String(error),
    });

    throw new HttpError(502, `Failed to generate text with Vertex AI model (${modelName}).`, {
      provider: 'vertex-ai',
      endpoint,
      statusCode: errorContext.statusCode,
      rawResponseText: errorContext.rawBody,
      parsedErrorDetails: errorContext.parsedDetails,
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

Return ONLY valid JSON with this exact shape:
{
  "ideas": [
    {
      "title": "...",
      "whyItWorks": "...",
      "suggestedChannel": "..."
    }
  ]
}

Rules:
- Do not include markdown fences.
- Do not include commentary outside JSON.
- Return exactly 10 items in ideas.`;

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
  const ideasText = await callVertexText(buildIdeasPrompt(input), modelName);
  const normalizedText = sanitizeJsonText(ideasText);

  try {
    const parsed = JSON.parse(normalizedText);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new HttpError(502, 'Vertex AI returned invalid JSON for ideas generation.', {
      provider: 'vertex-ai',
      reason: error?.message || String(error),
      rawResponseText: ideasText,
    });
  }
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
