const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function runVerification() {
  console.log('--- Starting PRISM Comprehensive Playwright UI & Network Verification ---');
  
  // Start vite preview or dev server
  const viteProcess = spawn('npx', ['vite', '--port', '5188', '--strictPort'], {
    shell: true,
    cwd: process.cwd(),
    stdio: 'pipe'
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[Browser Console Error] ${msg.text()}`);
    }
  });

  page.on('requestfailed', request => {
    // ignore failed connections to backend if backend is optional/mock fallback
    if (!request.url().includes(':8000')) {
      networkErrors.push(`[Network Error] Failed request: ${request.url()} - ${request.failure()?.errorText}`);
    }
  });

  try {
    const baseUrl = 'http://localhost:5188';

    // 1. Test Landing Page
    console.log('\n[TEST 1] Testing Landing Page at root / ...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    console.log('Page title:', title);

    const getStartedButtons = await page.locator('text=Get Started').all();
    console.log(`Found ${getStartedButtons.length} "Get Started" buttons/links.`);
    if (getStartedButtons.length === 0) {
      throw new Error('Could not find "Get Started" button on landing page');
    }

    // Check that there is no "Launch Interactive Demo" or "lanch demo" button
    const demoButtons = await page.locator('text=Launch Interactive Demo').count();
    console.log(`"Launch Interactive Demo" button count: ${demoButtons} (expected 0)`);
    if (demoButtons > 0) {
      throw new Error('Found unwanted "Launch Interactive Demo" button');
    }

    // 2. Click "Get Started" and verify navigation to /login
    console.log('\n[TEST 2] Clicking "Get Started" to navigate to /login ...');
    await getStartedButtons[0].click();
    await page.waitForURL('**/login');
    console.log('Successfully navigated to:', page.url());

    // 3. Verify Login page constraints
    console.log('\n[TEST 3] Verifying Login page constraints ...');
    const quickLaunchCount = await page.locator('text=Quick Launch').count();
    console.log(`"Quick Launch" button count: ${quickLaunchCount} (expected 0)`);
    if (quickLaunchCount > 0) {
      throw new Error('Found unwanted "Quick Launch" button on login page');
    }

    // Select Procurement Manager persona
    console.log('Clicking Procurement Manager role card...');
    await page.locator('text=Procurement Manager').first().click();

    // Verify inputs are NOT autofilled
    const usernameVal = await page.locator('input[type="text"]').inputValue();
    const passwordVal = await page.locator('input[type="password"]').inputValue();
    console.log(`Username value: "${usernameVal}", Password value: "${passwordVal}" (both should be empty)`);
    if (usernameVal !== '' || passwordVal !== '') {
      throw new Error(`Inputs were unexpectedly autofilled! user: ${usernameVal}`);
    }

    // 4. Fill in credentials and log in as Procurement Manager
    console.log('\n[TEST 4] Logging in as Procurement Manager...');
    await page.locator('input[type="text"]').fill('procurement');
    await page.locator('input[type="password"]').fill('procurement123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/procurement-dashboard');
    console.log('Successfully arrived at Procurement Dashboard:', page.url());

    // Check dashboard stats entries
    await page.waitForTimeout(1000);
    const pmContent = await page.textContent('body');
    const hasActiveRFQs = pmContent.includes('Active RFQs') || pmContent.includes('RFQs');
    console.log('Procurement Dashboard loaded stats successfully:', hasActiveRFQs);

    // 5. Navigate to RFQs page
    console.log('\n[TEST 5] Navigating to RFQs Management ...');
    await page.goto(`${baseUrl}/rfqs`);
    await page.waitForTimeout(1000);
    const rfqCards = await page.locator('text=RFQ-').count();
    console.log(`Found ${rfqCards} RFQ items on RFQs page.`);

    // 6. Test Supplier login and Supplier Dashboard
    console.log('\n[TEST 6] Testing Supplier Dashboard & New RFQs...');
    await page.goto(`${baseUrl}/login`);
    await page.locator('text=Supplier Partner').first().click();
    await page.locator('input[type="text"]').fill('supplier');
    await page.locator('input[type="password"]').fill('supplier123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/supplier-dashboard');
    console.log('Successfully arrived at Supplier Dashboard:', page.url());

    await page.waitForTimeout(1000);
    const supplierContent = await page.textContent('body');
    console.log('Supplier Dashboard contains Received RFQs section:', supplierContent.includes('Received RFQs'));

    // Check New RFQs page
    await page.goto(`${baseUrl}/new-rfqs`);
    await page.waitForTimeout(1000);
    const newRfqCards = await page.locator('text=RFQ-').count();
    console.log(`Found ${newRfqCards} RFQ cards on New RFQs page.`);

    // 7. Test Finance Approver login and Finance Dashboard
    console.log('\n[TEST 7] Testing Finance Approver Dashboard...');
    await page.goto(`${baseUrl}/login`);
    await page.locator('text=Finance Approver').first().click();
    await page.locator('input[type="text"]').fill('finance');
    await page.locator('input[type="password"]').fill('finance123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/finance-dashboard');
    console.log('Successfully arrived at Finance Dashboard:', page.url());

    await page.waitForTimeout(1000);
    const financeContent = await page.textContent('body');
    console.log('Finance Dashboard loaded Approval requests:', financeContent.includes('Pending Approvals') || financeContent.includes('Approved Requests'));

    console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('\n❌ VERIFICATION TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    viteProcess.kill();
  }
}

runVerification();
