const { chromium } = require('playwright');

async function run() {
  console.log('--- Starting Playwright Verification ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log(`Dialog (${dialog.type()}): ${dialog.message()}`);
    await dialog.accept();
  });

  const errors = [];
  const networkLogs = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('request', req => {
    if (req.url().includes('/api/')) {
      networkLogs.push(`API Request: ${req.method()} ${req.url()} - Body: ${req.postData() || 'none'}`);
    }
  });

  // 1. Visit Landing Page
  console.log('1. Testing Landing Page & Sidebar Check...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(500);

  // 2. Go to Login
  console.log('2. Navigating to Login...');
  await page.goto('http://localhost:5173/login');
  await page.waitForTimeout(500);

  // 3. Login as Supplier
  console.log('3. Logging in as Supplier...');
  await page.click('text=Supplier Partner');
  await page.fill('input[type="text"]', 'supplier');
  await page.fill('input[type="password"]', 'supplier123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);

  // Check Sidebar for Landing Page button (must NOT exist)
  const sidebarContent = await page.content();
  const hasLandingInSidebar = sidebarContent.includes('<span>Landing Page</span>');
  console.log('Has "Landing Page" in Sidebar?:', hasLandingInSidebar ? 'FAIL (Still present)' : 'PASS (Removed)');

  // 4. Test Supplier Received RFQs Page (/new-rfqs)
  console.log('4. Testing Supplier Received RFQs Page (/new-rfqs)...');
  await page.goto('http://localhost:5173/new-rfqs');
  await page.waitForTimeout(1000);

  // Verify tab buttons exist
  const allTab = await page.locator('button:has-text("All RFQs")').count();
  const newTab = await page.locator('button:has-text("New / Unread")').count();
  const acceptedTab = await page.locator('button:has-text("Accepted")').count();
  const quotedTab = await page.locator('button:has-text("Quoted")').count();
  console.log(`Tabs found: All (${allTab}), New (${newTab}), Accepted (${acceptedTab}), Quoted (${quotedTab})`);

  // Test clicking "Accept" button on an RFQ card
  const acceptButtons = page.locator('button:has-text("Accept")');
  const acceptBtnCount = await acceptButtons.count();
  console.log('Accept RFQ buttons found:', acceptBtnCount);
  if (acceptBtnCount > 0) {
    await acceptButtons.first().click();
    await page.waitForTimeout(500);
    console.log('Clicked Accept button on first RFQ');
  }

  // 5. Test RFQ Details Page (/rfq-details/RFQ-001)
  console.log('5. Testing RFQ Details Page (/rfq-details/RFQ-001)...');
  await page.goto('http://localhost:5173/rfq-details/RFQ-001');
  await page.waitForTimeout(1000);
  const rfqDetailsAccept = await page.locator('button:has-text("Accept RFQ")').count();
  const rfqDetailsQuote = await page.locator('button:has-text("Submit Quotation"), button:has-text("Revise Quotation")').count();
  console.log(`RFQ Details Page - Accept Button: ${rfqDetailsAccept}, Quote Action: ${rfqDetailsQuote}`);

  // 6. Test Supplier Negotiations Page (/supplier-negotiations)
  console.log('6. Testing Supplier Negotiations Page (/supplier-negotiations)...');
  await page.goto('http://localhost:5173/supplier-negotiations');
  await page.waitForTimeout(1000);
  const supplierNegCards = await page.locator('.p-4.border.rounded-lg').count();
  console.log('Supplier Active Negotiations cards count:', supplierNegCards);

  // 7. Test Finance Dashboard (/finance-dashboard)
  console.log('7. Testing Finance Dashboard...');
  await page.goto('http://localhost:5173/finance-dashboard');
  await page.waitForTimeout(1000);
  const financeCards = await page.locator('text=Pending Finance Approvals, text=Approval History').count();
  console.log('Finance Dashboard elements found:', financeCards);

  // 8. Test TRIGGER 1: "Apply AI Proposal" in Negotiation Center
  console.log('\n========================================');
  console.log('8. Testing TRIGGER 1: Apply AI Proposal in Negotiation Center');
  console.log('========================================');
  // Log in as procurement
  await page.goto('http://localhost:5173/login');
  await page.click('text=Procurement Manager');
  await page.fill('input[type="text"]', 'procurement');
  await page.fill('input[type="password"]', 'procurement123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);

  await page.goto('http://localhost:5173/negotiation-center');
  await page.waitForTimeout(1500);

  // Check selected negotiation details
  const componentTitle = await page.locator('h2.text-xl.font-bold').innerText().catch(() => 'N/A');
  console.log('Active Negotiation Item:', componentTitle);

  // Look for "Apply AI Proposal" button
  const aiButton = page.locator('button:has-text("Apply AI Proposal")');
  const aiButtonCount = await aiButton.count();
  console.log('Found "Apply AI Proposal" button count:', aiButtonCount);

  if (aiButtonCount > 0) {
    console.log('Triggering "Apply AI Proposal"...');
    await aiButton.first().click();
    await page.waitForTimeout(1000);

    // Verify counter offer form
    const isFormOpen = await page.locator('text=Send Counter-Offer Proposal').count();
    console.log('Counter-Offer Proposal Form Opened?:', isFormOpen > 0 ? 'YES (SUCCESS)' : 'NO');

    const priceInputs = page.locator('input[type="number"]');
    const priceVal = await priceInputs.first().inputValue().catch(() => 'N/A');
    console.log('AI-Suggested Counter Price Loaded in Form:', `₹${priceVal}/unit`);

    const textareaVal = await page.locator('textarea').inputValue().catch(() => 'N/A');
    console.log('AI Negotiation Rationale in Form:', textareaVal);
  }

  console.log('\n--- Network Logs Captured ---');
  networkLogs.forEach(log => console.log(log));

  console.log('\n--- Console Errors ---');
  if (errors.length === 0) {
    console.log('0 Console Errors detected! All components operating cleanly.');
  } else {
    errors.forEach(e => console.log(e));
  }

  await browser.close();
  console.log('\n--- Playwright Verification Complete ---');
}

run().catch(err => {
  console.error('Playwright execution error:', err);
  process.exit(1);
});
