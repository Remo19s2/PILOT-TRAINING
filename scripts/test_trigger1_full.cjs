const { chromium } = require('playwright');

async function testTrigger1() {
  console.log('=====================================================');
  console.log('PRISM E2E TRIGGER 1 TEST: NEGOTIATION_REQUEST');
  console.log('=====================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log(`[DIALOG] ${dialog.type().toUpperCase()}: ${dialog.message()}`);
    await dialog.accept();
  });

  const apiEvents = [];
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`Console Error: ${msg.text()}`);
  });

  page.on('request', req => {
    if (req.url().includes('/api/')) {
      apiEvents.push({
        method: req.method(),
        url: req.url(),
        data: req.postData() ? JSON.parse(req.postData().catch ? '{}' : req.postData()) : null
      });
    }
  });

  // STEP 1: Log in as Procurement Manager
  console.log('\n--- Step 1: Procurement Manager Login ---');
  await page.goto('http://localhost:5173/login');
  await page.click('text=Procurement Manager');
  await page.fill('input[type="text"]', 'procurement');
  await page.fill('input[type="password"]', 'procurement123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  console.log('Logged in as Procurement Manager, navigated to:', page.url());

  // STEP 2: Navigate to Negotiation Center
  console.log('\n--- Step 2: Open Negotiation Center Workspace ---');
  await page.goto('http://localhost:5173/negotiation-center');
  await page.waitForTimeout(1500);

  const selectedItem = await page.locator('h2.text-xl.font-bold').innerText().catch(() => 'N/A');
  console.log('Active Negotiation Component:', selectedItem);

  // Take screenshot of Initial Negotiation Center
  await page.screenshot({ path: 'scripts/trigger1_step1_initial.png', fullPage: true });

  // STEP 3: Trigger Event 1 - NEGOTIATION_REQUEST (Apply AI Proposal)
  console.log('\n--- Step 3: Triggering AI Negotiation Workflow (Event Ingestion) ---');
  const aiBtn = page.locator('button:has-text("Apply AI Proposal")');
  const count = await aiBtn.count();
  console.log('Apply AI Proposal button visible:', count > 0 ? 'YES' : 'NO');

  if (count > 0) {
    await aiBtn.first().click();
    await page.waitForTimeout(1500);
    console.log('AI Proposal Trigger fired!');

    // Capture screenshot of AI Proposal applied & Counter-offer form
    await page.screenshot({ path: 'scripts/trigger1_step2_ai_draft.png', fullPage: true });

    const strategyText = await page.locator('p.text-xs.text-purple-900').innerText().catch(() => 'N/A');
    console.log('AI Negotiation Strategy Generated:', strategyText);

    const isFormOpen = await page.locator('text=Send Counter-Offer Proposal').count();
    console.log('Counter-Offer Proposal Form Ready for HITL Review?:', isFormOpen > 0 ? 'YES' : 'NO');

    const proposedPriceInput = page.locator('input[type="number"]').first();
    const proposedPrice = await proposedPriceInput.inputValue().catch(() => 'N/A');
    console.log('AI Proposed Counter Price:', `₹${proposedPrice}/unit`);

    // STEP 4: Human-in-the-Loop (HITL) - Authorize & Dispatch Counter-Offer
    console.log('\n--- Step 4: Human-in-the-Loop Authorization & Dispatch ---');
    const sendOfferBtn = page.locator('button:has-text("Send Offer to Supplier"), button:has-text("Send Counter-Offer"), form button:has-text("Send")');
    const sendCount = await sendOfferBtn.count();
    console.log('Authorize & Send button found count:', sendCount);

    if (sendCount > 0) {
      await sendOfferBtn.first().click();
      await page.waitForTimeout(1500);
      console.log('Procurement Manager authorized and dispatched counter-offer to Supplier!');
      await page.screenshot({ path: 'scripts/trigger1_step3_dispatched.png', fullPage: true });
    }
  }

  // STEP 5: Verify Supplier Portal View
  console.log('\n--- Step 5: Supplier Persona Verification ---');
  await page.goto('http://localhost:5173/login');
  await page.click('text=Supplier Partner');
  await page.fill('input[type="text"]', 'supplier');
  await page.fill('input[type="password"]', 'supplier123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);

  await page.goto('http://localhost:5173/supplier-negotiations');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scripts/trigger1_step4_supplier_view.png', fullPage: true });

  const supplierCards = await page.locator('.p-4.border.rounded-lg').count();
  console.log('Supplier Inbound Negotiations Received:', supplierCards);

  console.log('\n=====================================================');
  console.log('TRIGGER 1 EXECUTION SUMMARY');
  console.log('=====================================================');
  console.log('API Event Ingestions:');
  const workflowEvents = apiEvents.filter(e => e.url.includes('/workflows/events'));
  workflowEvents.forEach(e => {
    console.log(JSON.stringify(e, null, 2));
  });

  console.log('Console Errors:', errors.length === 0 ? '0 Errors' : errors);
  await browser.close();
}

testTrigger1().catch(err => {
  console.error('Trigger 1 Test Failure:', err);
  process.exit(1);
});
