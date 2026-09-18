const { chromium } = require('playwright');
const fs = require('fs');

async function fixMasterWorkflow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let token = null;
  page.on('response', async (res) => {
    try {
      if (res.url().includes('/auth/login')) {
        const json = await res.json();
        token = json?.data?.token;
      }
    } catch(e) {}
  });

  try {
    await page.goto('https://agents.snsihub.ai/auth?redirect=%2Fdashboard');
    await page.fill('#login-email', 'nithis.r.ad.2024@snsce.ac.in');
    await page.fill('#login-password', 'Voldigo@1482');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);

 // Fetch latest master workflow
 const wfRes = await page.request.get('https://api.agents.snsihub.ai/workflows/30e5a837-22ec-4745-83f6-77fd6cfd7656', {
 headers: { 'Authorization': 'Bearer ' + token }
 });
 const wfJson = await wfRes.json();
 const wf = wfJson.data || wfJson;

 console.log('Original edges count:', wf.edges.length);
 console.log('Original nodes count:', wf.nodes.length);

 // 1. Fix Edges:
 // Change ifnode-1788674735302010 -> executeSubWorkflow-1788674034973003 to sourceHandle: 'true'
 wf.edges = wf.edges.map(e => {
 if (e.source === 'ifnode-1788674735302010' && e.target === 'executeSubWorkflow-1788674034973003') {
 console.log('Fixing edge: ifnode-1788674735302010 -> executeSubWorkflow-1788674034973003 sourceHandle: true');
 return { ...e, sourceHandle: 'true' };
 }
 return e;
 });

 // 2. Fix Nodes:
 wf.nodes = wf.nodes.map(n => {
 // Fix Planning IF condition
 if (n.id === 'ifnode-1788673030156001') {
 console.log('Fixing node: ifnode-1788673030156001 (Planning)');
 if (n.data?.inputs?.conditions?.conditions?.[0]) {
 n.data.inputs.conditions.conditions[0].leftValue = '{{[\ai-agent-orchestrator-1788605921365043\].json[\output\][\required_agents\]}}';
 }
 }
 // Fix Risk IF condition
 if (n.id === 'ifnode-1788674735302010') {
 console.log('Fixing node: ifnode-1788674735302010 (Risk)');
 if (n.data?.inputs?.conditions?.conditions?.[0]) {
 n.data.inputs.conditions.conditions[0].leftValue = '{{[\ai-agent-orchestrator-1788605921365043\].json[\output\][\required_agents\]}}';
 }
 }
 // Fix Supplier Intel IF condition
 if (n.id === 'ifnode-1788674735814011') {
 console.log('Fixing node: ifnode-1788674735814011 (Supplier Intel)');
 if (n.data?.inputs?.conditions?.conditions?.[0]) {
 n.data.inputs.conditions.conditions[0].leftValue = '{{[\ai-agent-orchestrator-1788605921365043\].json[\output\][\required_agents\]}}';
 }
 }
 // Fix Negotiation IF condition
 if (n.id === 'ifnode-1789641350635002') {
 console.log('Fixing node: ifnode-1789641350635002 (Negotiation)');
 if (n.data?.inputs?.conditions?.conditions?.[0]) {
 n.data.inputs.conditions.conditions[0].leftValue = '{{[\ai-agent-orchestrator-1788605921365043\].json[\output\][\required_agents\]}}';
 }
 }
 // Fix Decision IF condition
 if (n.id === 'ifnode-1788685879409004') {
 console.log('Fixing node: ifnode-1788685879409004 (Decision)');
 if (n.data?.inputs?.conditions?.conditions?.[0]) {
 n.data.inputs.conditions.conditions[0].leftValue = '{{[\ai-agent-orchestrator-1788684925951002\].json[\output\][\decision_required\]}}';
 }
 }
 // Fix Http Request headers
 if (n.id === 'httpRequest-1789531058863001') {
 console.log('Fixing node: httpRequest-1789531058863001');
 if (n.data?.inputs?.headers) {
 n.data.inputs.headers = {
 'Content-Type': 'application/json',
 'X-SNS-Webhook-Secret': '96052b9ff5cc48ab93ccf277cc555ca5052418dee940451cb790037984d53b3b'
 };
 }
 }
 return n;
 });

 // Save via POST /workflows/save
 const savePayload = {
 id: wf.id,
 projectId: wf.projectId,
 workspaceId: wf.workspaceId,
 name: wf.name,
 nodes: wf.nodes,
 edges: wf.edges
 };

 console.log('Sending save request...');
 const saveRes = await page.request.post('https://api.agents.snsihub.ai/workflows/save', {
 headers: {
 'Authorization': 'Bearer ' + token,
 'Content-Type': 'application/json'
 },
 data: savePayload
 });

 const saveResult = await saveRes.json();
 console.log('Save result status:', saveRes.status(), JSON.stringify(saveResult));

 // Also navigate to builder and click Save to ensure sync
 await page.goto('https://agents.snsihub.ai/builder?workspaceId=136766ce-f6b1-42d5-9a93-e596b6e6b4b6&projectId=9431eab1-a61b-4beb-9038-5038138b339b&workflowId=30e5a837-22ec-4745-83f6-77fd6cfd7656');
 await page.waitForTimeout(5000);
 const saveBtn = page.locator('button').filter({ hasText: /^Save$/i });
 if (await saveBtn.count() > 0) {
 await saveBtn.click();
 await page.waitForTimeout(3000);
 }
 await page.screenshot({ path: 'scripts/sns_workflow_fixed_deployed.png' });
 console.log('Screenshot taken: scripts/sns_workflow_fixed_deployed.png');

 } catch(err) {
 console.error(err);
 } finally {
 await browser.close();
 }
}
fixMasterWorkflow();
