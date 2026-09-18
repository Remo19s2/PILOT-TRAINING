const { chromium } = require('playwright');
const fs = require('fs');

async function testUpdateWorkflow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let token = null;

  page.on('response', async (res) => {
    try {
      if (res.url().includes('/auth/login')) {
        const json = await res.json();
        token = json?.data?.token;
      }
    } catch(e) {}
  });

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type= submit]');
    await page.waitForTimeout(4000);

    console.log('Login token:', token ? 'Found' : 'Missing');

    // Fetch current master workflow
    const wfRes = await page.request.get('https://api.agents.snsihub.ai/workflows/30e5a837-22ec-4745-83f6-77fd6cfd7656', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const wfData = await wfRes.json();
    console.log('Fetched master workflow successfully.');

  } catch(err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}
testUpdateWorkflow();
