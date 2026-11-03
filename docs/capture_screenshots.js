const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'assets', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const possiblePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const executablePath = possiblePaths.find(p => fs.existsSync(p));

console.log('Using browser executable:', executablePath);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,920']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 920, deviceScaleFactor: 2 });

  try {
    // 1. Landing Page
    console.log('Capturing 01-landing-page.png...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(2000);
    await page.screenshot({ path: path.join(outDir, '01-landing-page.png') });

    // 2. Login Page
    console.log('Capturing 02-login-page.png...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(1500);
    await page.screenshot({ path: path.join(outDir, '02-login-page.png') });

    // 3. Signup Page
    console.log('Capturing 03-signup-page.png...');
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(1500);
    await page.screenshot({ path: path.join(outDir, '03-signup-page.png') });

    // 4. Customer Login & Dashboard
    console.log('Logging in as customer user@smartserve.ai...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 30000 });
    // Click form button
    const submitBtn = await page.$('form button');
    // Clear and fill inputs
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      if (inputs[0]) inputs[0].value = 'user@smartserve.ai';
      if (inputs[1]) inputs[1].value = 'password123';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    });
    await sleep(500);
    await page.click('form button');
    await sleep(4000);

    console.log('Capturing 04-customer-dashboard.png...');
    await page.screenshot({ path: path.join(outDir, '04-customer-dashboard.png') });

    // 5. Open Booking Modal
    console.log('Opening Booking Modal...');
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Book now')) {
        await btn.click();
        break;
      }
    }
    await sleep(2000);
    console.log('Capturing 05-booking-modal.png...');
    await page.screenshot({ path: path.join(outDir, '05-booking-modal.png') });

    // Close modal by clicking cancel
    const modalButtons = await page.$$('button');
    for (const b of modalButtons) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && t.includes('Cancel')) {
        await b.click();
        break;
      }
    }
    await sleep(1500);

    // 6. Open AI Chatbot Widget
    console.log('Opening AI Chatbot widget...');
    const chatBtn = await page.$$('button');
    for (const b of chatBtn) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Ask SmartServe AI') || t.includes('SmartServe AI'))) {
        await b.click();
        break;
      }
    }
    await sleep(2500);
    // Click first suggestion chip if found
    const chip = await page.$('button.text-xs');
    if (chip) {
      await chip.click();
      await sleep(3000);
    }
    console.log('Capturing 06-ai-chatbot.png...');
    await page.screenshot({ path: path.join(outDir, '06-ai-chatbot.png') });

    // 7. Admin Analytics Dashboard
    console.log('Switching to Admin account admin@smartserve.ai...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate(() => {
      localStorage.clear();
      const inputs = document.querySelectorAll('input');
      if (inputs[0]) inputs[0].value = 'admin@smartserve.ai';
      if (inputs[1]) inputs[1].value = 'admin123';
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    });
    await sleep(500);
    await page.click('form button');
    await sleep(4000);

    console.log('Capturing 07-admin-analytics.png...');
    // Scroll down to show admin analytics and charts
    await page.evaluate(() => window.scrollBy(0, 600));
    await sleep(1500);
    await page.screenshot({ path: path.join(outDir, '07-admin-analytics.png') });

    // 8. Swagger UI
    console.log('Capturing 08-swagger-api-docs.png...');
    await page.goto('http://localhost:8080/swagger-ui/index.html', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(3000);
    await page.screenshot({ path: path.join(outDir, '08-swagger-api-docs.png') });

    console.log('SUCCESS! All 8 screenshots captured.');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
