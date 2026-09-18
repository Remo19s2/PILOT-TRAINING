const { chromium } = require('playwright');
const fs = require('fs');

async function captureSavePayload() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let savePayload = null;
  page.on('request', req => {
    if (req.url().includes('workflows/save')) {
      try {
        savePayload = JSON.parse(req.postData());
      } catch(e) {}
    }
  });

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type= submit]');
    await page.waitForTimeout(4000);

    await page.goto('https://agents.snsihub.ai/builder?workspaceId=136766ce-f6b1-42d5-9a93-e596b6e6b4b6&projectId=9431eab1-a61b-4beb-9038-5038138b339b&workflowId=30e5a837-22ec-4745-83f6-77fd6cfd7656');
    await page.waitForTimeout(5000);

    const saveBtn = page.locator('button').filter({ hasText: /^Save$/i });
    await saveBtn.click();
    await page.waitForTimeout(3000);

    if (savePayload) {
      console.log('Captured save payload keys:', Object.keys(savePayload));
      fs.writeFileSync('scripts/sns_save_payload_sample.json', JSON.stringify(savePayload, null, 2));
      console.log('Saved to scripts/sns_save_payload_sample.json');
    }

  } catch(err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}
captureSavePayload();
