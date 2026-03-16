import { config } from '../config.js';

const fallbackText = (title, prompt) =>
  `${title}\n\n[Offline fallback because GEMINI_API_KEY is missing]\n\n${prompt.slice(0, 1000)}`;

async function callGemini(prompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed: ${detail}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || 'No response generated.';
}

export async function generateText(prompt, title = 'Generated Draft') {
  if (!config.geminiApiKey) {
    return fallbackText(title, prompt);
  }

  return callGemini(prompt);
}
