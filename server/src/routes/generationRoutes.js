import { Router } from 'express';
import { generateText } from '../services/geminiService.js';
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
  const prompt = `You are an agency strategist creating an internal-use proposal draft.

Client name: ${clientName}
Offer / service: ${offer || 'Digital growth support'}
Tone: ${tone || 'confident and clear'}
Discovery notes:
${notes}

Write a polished proposal with these exact section headings in this exact order:
1) Client Summary
2) Problem
3) Solution
4) Scope
5) Timeline
6) Pricing
7) Next Steps

Rules:
- Keep it concise, practical, and implementation-ready.
- Use markdown headings (## Heading).
- Include specific assumptions where details are missing.
- Do not include any extra sections before, between, or after the required sections.`;
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

router.post('/export-pdf', handle(async (req, res) => {
  const pdfBuffer = await exportProposalPdf(req.body);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="proposal.pdf"');
  res.send(pdfBuffer);
}));

export default router;
