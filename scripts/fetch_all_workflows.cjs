const { chromium } = require('playwright');
const fs = require('fs');

async function inspectAllWorkflows() {
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

    const projRes = await page.request.get('https://api.agents.snsihub.ai/projects/9431eab1-a61b-4beb-9038-5038138b339b', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const projData = await projRes.json();
    fs.writeFileSync('scripts/project_workflows_list.json', JSON.stringify(projData, null, 2));

    const wfs = projData?.data?.workflows || [];
    console.log('Workflows in project count:', wfs.length);
    for (const w of wfs) {
      console.log('Fetching workflow:', w.id, w.name);
      const wRes = await page.request.get('https://api.agents.snsihub.ai/workflows/' + w.id, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const wData = await wRes.json();
      fs.writeFileSync('scripts/workflow_' + w.id + '.json', JSON.stringify(wData, null, 2));
    }

  } catch(err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}
inspectAllWorkflows();
