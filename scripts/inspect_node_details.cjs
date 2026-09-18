const { chromium } = require('playwright');

async function inspectNodes() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Capture all API responses
  const apiResponses = {};
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (url.includes('workflow') || url.includes('agent') || url.includes('project') || url.includes('canvas')) {
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('application/json')) {
          apiResponses[url] = await res.json();
        }
      }
    } catch(e) {}
  });

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type= submit]');
    await page.waitForTimeout(4000);

    await page.goto('https://agents.snsihub.ai/workspaces/136766ce-f6b1-42d5-9a93-e596b6e6b4b6/projects/9431eab1-a61b-4beb-9038-5038138b339b');
    await page.waitForTimeout(3000);

    const row = page.locator('tr').filter({ hasText: 'master workflow' });
    await row.locator('button').filter({ hasText: 'VIEW' }).click();
    await page.waitForTimeout(5000);

    console.log('Workflow URL:', page.url());
    console.log('API Responses captured keys:', Object.keys(apiResponses));

    // Save API responses to file
    const fs = require('fs');
    fs.writeFileSync('scripts/sns_master_workflow_data.json', JSON.stringify(apiResponses, null, 2));
    console.log('Saved sns_master_workflow_data.json');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

inspectNodes();
