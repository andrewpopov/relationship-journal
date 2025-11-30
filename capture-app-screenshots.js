const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:5173';
  const screenshotsDir = path.join(__dirname, 'screenshots');

  // Ensure screenshots directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Starting screenshot capture...\n');

  try {
    // 1. Capture Login Page
    console.log('Capturing login page...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Extra wait for any animations
    await page.screenshot({
      path: path.join(screenshotsDir, '01-login-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 01-login-page.png\n');

    // 2. Capture Register Page
    console.log('Capturing register page...');
    await page.goto(`${baseUrl}/register`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '02-register-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 02-register-page.png\n');

    // 3. Login with test credentials
    console.log('Logging in with test credentials...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Fill in login form using ID selectors
    await page.fill('#username', 'test@example.com');
    await page.fill('#password', 'testpass123');

    // Wait for the login API response and URL change
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/auth/login') && resp.status() === 200, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);

    console.log('Login API response:', response.status());

    // Wait for React to process the response and redirect
    try {
      await page.waitForURL(`${baseUrl}/`, { timeout: 5000 });
    } catch (e) {
      console.log('Warning: URL did not change to /, checking current URL...');
      console.log('Current URL:', page.url());
      // If we're not at /, try navigating there
      if (!page.url().endsWith('/')) {
        await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      }
    }

    // Additional wait to ensure page is fully loaded
    await page.waitForTimeout(1000);

    console.log('✓ Successfully logged in\n');

    // 4. Capture Home/Dashboard
    console.log('Capturing home/dashboard page...');
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '03-home-dashboard.png'),
      fullPage: true
    });
    console.log('✓ Saved: 03-home-dashboard.png\n');

    // 5. Capture Journal Page
    console.log('Capturing journal page...');
    await page.goto(`${baseUrl}/journal`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '04-journal-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 04-journal-page.png\n');

    // 6. Capture Memories Page
    console.log('Capturing memories page...');
    await page.goto(`${baseUrl}/memories`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '05-memories-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 05-memories-page.png\n');

    // 7. Capture Gratitude Page
    console.log('Capturing gratitude page...');
    await page.goto(`${baseUrl}/gratitude`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '06-gratitude-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 06-gratitude-page.png\n');

    // 8. Capture Goals Page
    console.log('Capturing goals page...');
    await page.goto(`${baseUrl}/goals`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '07-goals-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 07-goals-page.png\n');

    // 9. Capture Questions Page
    console.log('Capturing questions page...');
    await page.goto(`${baseUrl}/questions`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '08-questions-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 08-questions-page.png\n');

    // 10. Capture Daily Question Page
    console.log('Capturing daily question page...');
    await page.goto(`${baseUrl}/daily-question`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(screenshotsDir, '09-daily-question-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 09-daily-question-page.png\n');

    // 11. Capture Journey Book Page
    console.log('Capturing journey book page...');
    await page.goto(`${baseUrl}/journey-book`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(screenshotsDir, '10-journey-book-page.png'),
      fullPage: true
    });
    console.log('✓ Saved: 10-journey-book-page.png\n');

    console.log('='.repeat(50));
    console.log('All screenshots captured successfully!');
    console.log('Screenshots saved to:', screenshotsDir);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Error during screenshot capture:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
