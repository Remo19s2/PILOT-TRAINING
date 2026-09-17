const { chromium } = require('playwright');

async function searchTemplates() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
  await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
  await page.fill('#login-password', 'Voldigo@1482');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  await page.goto('https://agents.snsihub.ai/marketplace');
  await page.waitForTimeout(2000);

  // Search "SUPPLY"
  console.log('Searching "SUPPLY"...');
  const searchInput = page.locator('input[placeholder*="search" i], input[type="text"]').first();
  await searchInput.fill('SUPPLY');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  console.log('Search "SUPPLY" results:\n', (await page.innerText('body')).slice(0, 1500));

  await browser.close();
}

searchTemplates().catch(console.error);
