const { chromium } = require('playwright');

async function getWorkflows() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

    console.log('Clicking WORKSPACE button...');
    await page.locator('button:has-text("WORKSPACE:")').click();
    await page.waitForTimeout(1000);

    console.log('Clicking button with text Nexus...');
    const nexusBtn = page.locator('button:has-text("Nexus")');
    await nexusBtn.click();
    await page.waitForTimeout(4000);

    console.log('Current URL after clicking Nexus:', page.url());
    await page.screenshot({ path: 'scripts/sns_nexus_dashboard.png', fullPage: true });

    console.log('\n--- Nexus Dashboard Content ---');
    console.log(await page.innerText('body'));

    // Go to My Projects
    console.log('\nNavigating to My Projects in Nexus...');
    await page.locator('button:has-text("My Projects")').click();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'scripts/sns_nexus_projects.png', fullPage: true });
    console.log('\n--- Nexus My Projects Content ---');
    console.log(await page.innerText('body'));

    // Find all cards / links / workflows
    const allTextBlocks = await page.$$eval('div, p, h1, h2, h3, h4, span, button', els =>
      els.map(e => e.innerText?.trim()).filter(t => t && t.length > 5 && t.length < 150)
    );
    console.log('\n--- All Text Elements in Projects ---');
    console.log(Array.from(new Set(allTextBlocks)).slice(0, 30));

  } catch (err) {
    console.error('Error in Nexus workflow fetch:', err);
  } finally {
    await browser.close();
  }
}

getWorkflows().catch(console.error);
