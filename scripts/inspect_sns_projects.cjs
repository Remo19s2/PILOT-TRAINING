const { chromium } = require('playwright');

async function inspectInteractive() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
  await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
  await page.fill('#login-password', 'Voldigo@1482');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);
  console.log('Logged in URL:', page.url());

  // Click on "Agent Builder" or "My Projects" or "START BUILDING"
  const clickableItems = await page.$$eval('button, [role="button"], div, span', els => 
    els.filter(e => {
      const text = e.innerText?.trim();
      return text && (
        text === 'Agent Builder' ||
        text === 'My Projects' ||
        text === 'MY PROJECTS' ||
        text === 'OPEN BUILDER' ||
        text === 'START BUILDING' ||
        text.includes('WORKFLOW')
      );
    }).map(e => ({ tag: e.tagName, text: e.innerText?.trim() }))
  );
  console.log('Clickable elements found:', JSON.stringify(clickableItems, null, 2));

  // Let's click "My Projects"
  console.log('\nClicking "My Projects"...');
  await page.locator('text=My Projects').first().click().catch(e => console.log('Click err:', e.message));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'scripts/sns_my_projects_clicked.png', fullPage: true });
  console.log('Current URL after My Projects:', page.url());
  console.log('Content after My Projects:\n', (await page.innerText('body')).slice(0, 1500));

  // Let's click "Agent Builder"
  console.log('\nClicking "Agent Builder"...');
  await page.locator('text=Agent Builder').first().click().catch(e => console.log('Click err:', e.message));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'scripts/sns_agent_builder_clicked.png', fullPage: true });
  console.log('Current URL after Agent Builder:', page.url());
  console.log('Content after Agent Builder:\n', (await page.innerText('body')).slice(0, 1500));

  await browser.close();
}

inspectInteractive().catch(console.error);
