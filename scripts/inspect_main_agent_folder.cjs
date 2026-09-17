const { chromium } = require('playwright');

async function inspectMainAgentWorkflow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    // Switch to Nexus workspace directly by URL
    console.log('Navigating to Nexus projects URL...');
    await page.goto('https://agents.snsihub.ai/workspaces/136766ce-f6b1-42d5-9a93-e596b6e6b4b6/projects');
    await page.waitForTimeout(3000);

    // Click on "VIEW" button
    console.log('Opening Main Agent Workflow folder...');
    const viewBtn = page.locator('button:has-text("VIEW")').first();
    await viewBtn.click();
    await page.waitForTimeout(3000);

    console.log('Inside folder URL:', page.url());
    await page.screenshot({ path: 'scripts/sns_nexus_main_agent_folder.png', fullPage: true });

    const folderContent = await page.innerText('body');
    console.log('\n--- 6 Workflows in Main Agent Workflow Folder ---\n');
    console.log(folderContent);

    // Extract all rows in table
    const rows = await page.$$eval('tr', trs => trs.map(r => r.innerText.trim().replace(/\t+/g, ' | ')));
    console.log('\n--- Workflow Rows ---\n', JSON.stringify(rows, null, 2));

  } catch (err) {
    console.error('Error inspecting folder:', err);
  } finally {
    await browser.close();
  }
}

inspectMainAgentWorkflow().catch(console.error);
