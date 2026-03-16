const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();

router.post('/export-pdf', async (req, res) => {
  let browser;

  try {
    const { html, fileName } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'html is required.' });
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    const safeFileName = `${(fileName || 'document').replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to export PDF.',
      details: error.message
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
