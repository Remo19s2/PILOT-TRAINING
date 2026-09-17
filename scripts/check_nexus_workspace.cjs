const { chromium } = require('playwright');

async function checkNexusWorkspace() {
  console.log('--- Switching to Nexus Workspace ---');
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
    console.log('Logged in to dashboard!');

    // Look for workspace dropdown in sidebar (near WORKSPACE: Personal)
    await page.screenshot({ path: 'scripts/sns_dashboard_before_switch.png', fullPage: true });

    // Look for all elements containing "Personal" or workspace selector
    console.log('Looking for workspace switcher...');
    const workspaceElement = page.locator('text=Personal, [class*="workspace" i]').first();
    await workspaceElement.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'scripts/sns_workspace_menu.png', fullPage: true });

    // Check if Nexus is listed
    console.log('Looking for "Nexus" option...');
    const nexusOption = page.locator('text=Nexus, text=NEXUS, div:has-text("Nexus"), span:has-text("Nexus")').first();
    const nexusFound = await nexusOption.count();
    console.log('Nexus option found count:', nexusFound);

    if (nexusFound > 0) {
      console.log('Clicking Nexus workspace...');
      await nexusOption.click();
      await page.waitForTimeout(3000);
      console.log('Switched workspace! Current URL:', page.url());
      await page.screenshot({ path: 'scripts/sns_nexus_dashboard.png', fullPage: true });

      const pageText = await page.innerText('body');
      console.log('\n--- Nexus Workspace Content ---');
      console.log(pageText.slice(0, 2000));

      // Check My Projects in Nexus workspace
      console.log('\nNavigating to My Projects in Nexus...');
      await page.locator('text=My Projects, text=MY PROJECTS').first().click().catch(() => {});
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'scripts/sns_nexus_projects.png', fullPage: true });

      const projectsText = await page.innerText('body');
      console.log('\n--- Nexus Projects Content ---');
      console.log(projectsText.slice(0, 3000));
    } else {
      console.log('Listing all text on page to find workspace menu items:');
      const allText = await page.innerText('body');
      console.log(allText.slice(0, 1500));
    }
  } catch (err) {
    console.error('Error switching workspace:', err);
  } finally {
    await browser.close();
  }
}

checkNexusWorkspace();
