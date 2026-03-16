import { Router } from 'express';
import { generateImage, generateText } from '../services/geminiService.js';
import { exportProposalPdf } from '../services/pdfService.js';

const router = Router();

const handle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (error) {
    next(error);
  }
};

router.post('/generate-proposal', handle(async (req, res) => {
  const { clientName, notes, offer, tone } = req.body;
  const prompt = `Write a polished agency proposal for ${clientName}. Tone: ${tone || 'confident and clear'}. Offer: ${offer || 'digital growth support'}. Notes:\n${notes}`;
  const content = await generateText(prompt, 'Proposal Draft');
  res.json({ content });
}));

router.post('/generate-email', handle(async (req, res) => {
  const { objective, audience, context, tone } = req.body;
  const prompt = `Draft a conversion-focused email. Objective: ${objective}. Audience: ${audience}. Tone: ${tone || 'professional'}\nContext:\n${context}`;
  const content = await generateText(prompt, 'Email Draft');
  res.json({ content });
}));

router.post('/generate-ideas', handle(async (req, res) => {
  const { niche, channels, goal } = req.body;
  const prompt = `Generate 10 actionable content ideas for niche: ${niche}. Channels: ${channels}. Goal: ${goal}. For each idea include hook + CTA.`;
  const content = await generateText(prompt, 'Ideas Draft');
  res.json({ content });
}));

router.post('/generate-image', handle(async (req, res) => {
  const { prompt } = req.body;
  const image = await generateImage(prompt);
  res.json(image);
}));

router.post('/generate-video-script', handle(async (req, res) => {
  const { objective, audience, product, lengthSeconds } = req.body;
  const prompt = `Create a video script for ${product}. Audience: ${audience}. Objective: ${objective}. Duration: ${lengthSeconds || 45} seconds. Include scene directions and CTA.`;
  const content = await generateText(prompt, 'Video Script');
  res.json({ content });
}));

router.post('/generate-video', handle(async (_req, res) => {
  res.status(501).json({
    status: 'not_implemented',
    message: 'Video generation endpoint scaffolded for future integration.',
  });
}));

router.post('/export-pdf', handle(async (req, res) => {
  const pdfBuffer = await exportProposalPdf(req.body);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="proposal.pdf"');
  res.send(pdfBuffer);
}));

export default router;
