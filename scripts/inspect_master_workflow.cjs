const { chromium } = require('playwright');

async function inspectWorkflowDetails() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    // Direct to folder URL
    console.log('Navigating to Main Agent Workflow folder...');
    await page.goto('https://agents.snsihub.ai/workspaces/136766ce-f6b1-42d5-9a93-e596b6e6b4b6/projects/9431eab1-a61b-4beb-9038-5038138b339b');
    await page.waitForTimeout(3000);

    // Open "master workflow"
    console.log('Clicking VIEW on "master workflow"...');
    const masterViewBtn = page.locator('tr:has-text("master workflow") button:has-text("VIEW")');
    await masterViewBtn.click();
    await page.waitForTimeout(4000);

    console.log('Master Workflow Builder URL:', page.url());
    await page.screenshot({ path: 'scripts/sns_master_workflow_canvas.png', fullPage: true });

    // Look for Webhook Trigger node or Webhook URL or Deploy button
    const canvasContent = await page.innerText('body');
    console.log('\n--- Master Workflow Canvas Text ---\n', canvasContent.slice(0, 2000));

    // Look for all buttons on top bar (Deploy, Run, Active/Inactive switch, Webhook URL)
    const topButtons = await page.$$eval('button, [role="switch"], input', els =>
      els.map(e => ({ tag: e.tagName, text: e.innerText?.trim(), value: e.value, className: e.className })).filter(e => e.text || e.value)
    );
    console.log('\n--- Buttons / Controls on Canvas ---\n', JSON.stringify(topButtons, null, 2));

    // Look for any webhook URLs in the page DOM
    const webhookUrls = await page.$$eval('*', els =>
      els.map(e => e.innerText?.trim() || e.getAttribute('value') || '').filter(t => t.includes('webhook') || t.includes('http'))
    );
    console.log('\n--- Webhook / HTTP URLs Found ---\n', Array.from(new Set(webhookUrls)).slice(0, 10));

  } catch (err) {
    console.error('Error inspecting master workflow:', err);
  } finally {
    await browser.close();
  }
}

inspectWorkflowDetails().catch(console.error);
