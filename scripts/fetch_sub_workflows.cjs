const { chromium } = require('playwright');
const fs = require('fs');

async function fetchSubWorkflows() {
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

    const wfIds = [
      '87460d93-8050-479e-90b3-b6be8faf0169', // planning
      'b13828ff-e7b1-48a8-ac7f-993a93a4fdba', // decision
      'd5367bb5-515e-433b-b335-29d7dca21e77', // risk
      '6e8c48f9-fdab-46fc-bcdc-de0523a236a9', // supplier intel
      '0d634c62-de53-4d23-8ee1-7c1a4002d645'  // negotiation
    ];

    for (const id of wfIds) {
      console.log('Fetching workflow:', id);
      const res = await page.request.get('https://api.agents.snsihub.ai/workflows/' + id, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      fs.writeFileSync('scripts/subwf_' + id + '.json', JSON.stringify(data, null, 2));
    }
    console.log('Done fetching sub-workflows');

  } catch(err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}
fetchSubWorkflows();
