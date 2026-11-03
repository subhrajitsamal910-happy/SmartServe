const puppeteer = require('./docs/node_modules/puppeteer-core');
const path = require('path');
const os = require('os');
const executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    userDataDir: path.join(os.tmpdir(), 'edge_debug_' + Date.now()),
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.click('form button');
  await page.waitForFunction(() => window.location.pathname.includes('/dashboard'), { timeout: 15000 });

  // Wait for "Book now" button to appear once services finish loading!
  await page.waitForFunction(() => document.body.innerText.includes('Book now'), { timeout: 10000 });
  console.log('✓ "Book now" text appeared on page!');

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
  });
  console.log('Dashboard Buttons after fetch:', JSON.stringify(buttons, null, 2));

  await browser.close();
})();
