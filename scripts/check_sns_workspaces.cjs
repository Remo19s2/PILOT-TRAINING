const { chromium } = require('playwright');

async function checkWorkspaces() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
  await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
  await page.fill('#login-password', 'Voldigo@1482');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  console.log('Checking Workspace dropdown...');
  // Look for workspace element
  const workspaceBtn = page.locator('text=Personal, [class*="workspace"], button:has-text("Personal")').first();
  if (await workspaceBtn.count() > 0) {
    console.log('Clicking Workspace dropdown...');
    await workspaceBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'scripts/sns_workspaces.png', fullPage: true });
    console.log('Workspace options:\n', await page.innerText('body'));
  }

  // Also check Marketplace to see if any PRISM workflow exists
  console.log('\nChecking Marketplace...');
  await page.goto('https://agents.snsihub.ai/marketplace').catch(() => {});
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'scripts/sns_marketplace.png', fullPage: true });
  console.log('Marketplace page:\n', (await page.innerText('body')).slice(0, 1500));

  await browser.close();
}

checkWorkspaces().catch(console.error);
