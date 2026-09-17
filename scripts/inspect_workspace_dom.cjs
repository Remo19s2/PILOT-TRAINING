const { chromium } = require('playwright');

async function inspectWorkspaceSwitcher() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
  await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
  await page.fill('#login-password', 'Voldigo@1482');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  // Search for any element with "Personal" or "Nexus" or workspace
  const workspaceElements = await page.$$eval('*', els => 
    els.filter(e => {
      const t = e.innerText?.trim();
      return t && (t.includes('Personal') || t.includes('Nexus') || t.includes('WORKSPACE'));
    }).map(e => ({
      tag: e.tagName,
      className: e.className,
      text: e.innerText?.trim().slice(0, 50),
      id: e.id
    }))
  );

  console.log('Workspace elements found:', JSON.stringify(workspaceElements.slice(0, 15), null, 2));

  // Find the exact clickable element for workspace
  const allButtonsAndSelects = await page.$$eval('button, select, [role="combobox"], [role="button"], [class*="workspace"], [class*="select"]', els =>
    els.map(e => ({ tag: e.tagName, text: e.innerText?.trim(), className: e.className }))
  );
  console.log('\nButtons & Selects:\n', JSON.stringify(allButtonsAndSelects.slice(0, 20), null, 2));

  await page.screenshot({ path: 'scripts/sns_sidebar_inspect.png', fullPage: true });

  await browser.close();
}

inspectWorkspaceSwitcher().catch(console.error);
