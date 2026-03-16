import puppeteer from 'puppeteer';

const buildProposalHtml = ({ title, clientName, summary, scope, timeline, investment }) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title || 'Proposal'}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 36px; color: #0f172a; }
        h1 { margin-bottom: 4px; }
        h2 { margin-top: 26px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
        p { white-space: pre-wrap; line-height: 1.5; }
        .muted { color: #475569; margin-top: 0; }
        .badge { display:inline-block; background:#e2e8f0; color:#0f172a; border-radius:999px; padding:6px 12px; font-size:12px; }
      </style>
    </head>
    <body>
      <h1>${title || 'BuildByAlistar Proposal'}</h1>
      <p class="muted">Client: ${clientName || 'N/A'}</p>
      <span class="badge">Internal Agency OS Export</span>

      <h2>Executive Summary</h2>
      <p>${summary || ''}</p>

      <h2>Scope of Work</h2>
      <p>${scope || ''}</p>

      <h2>Timeline</h2>
      <p>${timeline || ''}</p>

      <h2>Investment</h2>
      <p>${investment || ''}</p>
    </body>
  </html>
`;

export async function exportProposalPdf(proposalPayload) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(buildProposalHtml(proposalPayload), { waitUntil: 'networkidle0' });
    return await page.pdf({ format: 'A4', printBackground: true, margin: { top: '16mm', right: '12mm', bottom: '16mm', left: '12mm' } });
  } finally {
    await browser.close();
  }
}
