import puppeteer from 'puppeteer';

const section = (title, content) => `
  <section>
    <h2>${title}</h2>
    <p>${content || 'Not provided.'}</p>
  </section>
`;

const buildProposalHtml = ({
  title,
  clientName,
  brandName,
  clientSummary,
  problem,
  solution,
  scope,
  timeline,
  pricing,
  nextSteps,
}) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title || 'Proposal'}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Inter, Arial, sans-serif; margin: 0; color: #0f172a; background: #f8fafc; }
        .sheet { max-width: 920px; margin: 0 auto; padding: 34px; }
        .header {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border-radius: 18px;
          padding: 28px;
          margin-bottom: 18px;
        }
        .label { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.9; }
        h1 { margin: 8px 0 0; font-size: 32px; line-height: 1.1; }
        .subhead { margin-top: 6px; font-size: 14px; opacity: 0.95; }
        .badge {
          display: inline-block;
          margin-top: 12px;
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
        }
        section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          margin-top: 12px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }
        h2 {
          margin: 0 0 10px;
          color: #312e81;
          font-size: 16px;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }
        p { margin: 0; white-space: pre-wrap; line-height: 1.5; font-size: 14px; }
      </style>
    </head>
    <body>
      <main class="sheet">
        <header class="header">
          <div class="label">${brandName || 'Agency OS MVP'}</div>
          <h1>${title || 'Client Proposal'}</h1>
          <div class="subhead">Prepared for: ${clientName || 'N/A'}</div>
          <span class="badge">Internal-use export • No auth enabled</span>
        </header>

        ${section('Client Summary', clientSummary)}
        ${section('Problem', problem)}
        ${section('Solution', solution)}
        ${section('Scope', scope)}
        ${section('Timeline', timeline)}
        ${section('Pricing', pricing)}
        ${section('Next Steps', nextSteps)}
      </main>
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
