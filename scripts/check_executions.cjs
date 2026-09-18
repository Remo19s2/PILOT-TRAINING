const { chromium } = require('playwright');

async function getExecutions() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let apiLogs = [];
  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (url.includes('execution') || url.includes('history') || url.includes('runs') || url.includes('log')) {
        const json = await res.json();
        console.log('Execution response from', url, JSON.stringify(json).slice(0, 300));
        apiLogs.push({ url, json });
      }
    } catch(e) {}
  });

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type= submit]');
    await page.waitForTimeout(4000);

    await page.goto('https://agents.snsihub.ai/builder?workspaceId=136766ce-f6b1-42d5-9a93-e596b6e6b4b6&projectId=9431eab1-a61b-4beb-9038-5038138b339b&workflowId=30e5a837-22ec-4745-83f6-77fd6cfd7656');
    await page.waitForTimeout(5000);

    const buttons = await page.eval('button, [role=tab]', els => els.map(e => e.innerText?.trim()).filter(Boolean));
    console.log('Buttons/tabs on page:', buttons);

    // Look for Executions / Runs
    const tabs = page.locator('button, [role=tab]').filter({ hasText: /execution|history|run|log/i });
    console.log('Matching tabs count:', await tabs.count());
    for (let i = 0; i < await tabs.count(); i++) {
      console.log('Tab', i, await tabs.nth(i).innerText());
    }

  } catch(err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}
getExecutions();
