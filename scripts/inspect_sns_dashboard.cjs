const { chromium } = require('playwright');

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://agents.snsihub.ai/dashboard', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('Goto err:', e.message));
  console.log('Current URL:', page.url());
  
  await page.screenshot({ path: 'scripts/sns_direct_dashboard.png', fullPage: true });

  const inputs = await page.$$eval('input', els => els.map(i => ({ type: i.type, name: i.name, placeholder: i.placeholder, id: i.id })));
  console.log('Inputs found:', JSON.stringify(inputs, null, 2));

  const buttons = await page.$$eval('button, a', els => els.map(b => ({ text: b.innerText?.trim(), href: b.getAttribute('href'), type: b.getAttribute('type') })));
  console.log('Buttons/Links found:', JSON.stringify(buttons.filter(b => b.text), null, 2));

  // If there are inputs, let's fill email & password
  if (inputs.some(i => i.type === 'email' || i.name === 'email' || i.type === 'text')) {
    const emailField = page.locator('input[type="email"], input[name="email"], input[type="text"]').first();
    const passField = page.locator('input[type="password"]').first();
    
    if (await passField.count() > 0) {
      console.log('Filling credentials...');
      await emailField.fill('nithis.r.ad.2024@snsce.ac.in');
      await passField.fill('Voldigo@1482');

      const submit = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Login")').first();
      await submit.click();
      await page.waitForTimeout(5000);
      console.log('After submit URL:', page.url());
      await page.screenshot({ path: 'scripts/sns_logged_in.png', fullPage: true });

      console.log('Dashboard content preview:\n', (await page.innerText('body')).slice(0, 2000));
    }
  }

  await browser.close();
}

inspect().catch(console.error);
