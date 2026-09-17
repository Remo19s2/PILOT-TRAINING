const { chromium } = require('playwright');

async function switchAndInspectNexus() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log(`[CONSOLE] ${msg.text()}`));

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    console.log('Clicking WORKSPACE button...');
    const wsBtn = page.locator('button:has-text("WORKSPACE:")');
    await wsBtn.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'scripts/sns_workspace_dropdown_open.png', fullPage: true });

    // Look for Nexus in the open dropdown menu
    console.log('Looking for Nexus in dropdown...');
    const menuItems = await page.$$eval('[role="menu"] *, [class*="dropdown"] *, [class*="popover"] *, button, div, span', els => 
      els.filter(e => e.innerText && e.innerText.toLowerCase().includes('nexus')).map(e => ({ tag: e.tagName, text: e.innerText.trim() }))
    );
    console.log('Nexus items found:', JSON.stringify(menuItems, null, 2));

    const nexusBtn = page.locator('text=Nexus, text=nexus, div:has-text("Nexus")').first();
    await nexusBtn.click();
    await page.waitForTimeout(3000);
    console.log('After switching to Nexus, current URL:', page.url());

    await page.screenshot({ path: 'scripts/sns_nexus_dashboard.png', fullPage: true });
    console.log('\n--- Nexus Dashboard Text ---\n', (await page.innerText('body')).slice(0, 1500));

    // Navigate to My Projects
    console.log('\nNavigating to My Projects in Nexus...');
    await page.locator('button:has-text("My Projects")').click();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'scripts/sns_nexus_projects.png', fullPage: true });
    const nexusProjects = await page.innerText('body');
    console.log('\n--- Nexus Projects List ---\n', nexusProjects);

    // List all workflows / cards in Nexus
    const cards = await page.$$eval('[class*="card"], [class*="project"], [class*="workflow"], div', els =>
      els.filter(e => e.innerText && (e.innerText.includes('WORKFLOW') || e.innerText.includes('Workflow') || e.innerText.includes('Agent') || e.innerText.includes('Trigger') || e.innerText.includes('PRISM') || e.innerText.includes('Master'))).map(e => e.innerText.trim().slice(0, 100))
    );
    console.log('\n--- Workflow Cards in Nexus ---\n', Array.from(new Set(cards)).slice(0, 20));

  } catch (err) {
    console.error('Error in Nexus inspection:', err);
    await page.screenshot({ path: 'scripts/sns_nexus_error.png', fullPage: true }).catch(() => {});
  } finally {
    await browser.close();
  }
}

switchAndInspectNexus().catch(console.error);
