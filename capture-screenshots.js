/**
 * Comprehensive Screenshot Capture Script for Relationship Journal
 *
 * This script uses Playwright to automatically capture screenshots of all
 * pages and states in the application.
 *
 * Prerequisites:
 * 1. Install Playwright: npm install -D @playwright/test
 * 2. Ensure the app is running on http://localhost:5173
 * 3. Run this script: node capture-screenshots.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureScreenshots() {
  console.log('Starting screenshot capture process...\n');

  const browser = await chromium.launch({ headless: false }); // Set to false to see what's happening
  const context = await browser.newContext({
    viewport: DESKTOP_VIEWPORT,
  });
  const page = await context.newPage();

  try {
    // 1. Capture Landing/Login Page
    console.log('📸 Capturing: Landing/Login Page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for any animations
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-landing-login.png'),
      fullPage: false
    });
    console.log('✅ Saved: 01-landing-login.png\n');

    // 2. Capture Register Page (if accessible)
    console.log('📸 Capturing: Register Page...');
    const registerLink = await page.locator('a[href="/register"], button:has-text("Register"), a:has-text("Register")').first();
    if (await registerLink.isVisible().catch(() => false)) {
      await registerLink.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '01b-register.png'),
        fullPage: false
      });
      console.log('✅ Saved: 01b-register.png\n');

      // Go back to login
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    }

    // 3. Perform Login (you may need to adjust credentials)
    console.log('🔐 Attempting login...');

    // Check if we need to register first or if test credentials exist
    // Try to login with test credentials
    const emailInput = await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const passwordInput = await page.locator('input[type="password"], input[name="password"]').first();
    const loginButton = await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      // Capture login form filled
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '01c-login-filled.png'),
        fullPage: false
      });
      console.log('✅ Saved: 01c-login-filled.png\n');

      await loginButton.click();
      await page.waitForTimeout(2000); // Wait for navigation
    }

    // Check if login was successful by looking for dashboard or protected content
    const currentUrl = page.url();
    console.log(`Current URL after login attempt: ${currentUrl}\n`);

    // If login failed, try to register and then continue
    if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
      console.log('⚠️  Login failed. Attempting to register new account...');
      await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle' });

      const nameInput = await page.locator('input[name="name"], input[placeholder*="name" i]').first();
      const partnerInput = await page.locator('input[name="partnerName"], input[placeholder*="partner" i]').first();
      const regEmailInput = await page.locator('input[type="email"], input[name="email"]').first();
      const regPasswordInput = await page.locator('input[type="password"], input[name="password"]').first();
      const registerButton = await page.locator('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")').first();

      if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('Test User');
      }
      if (await partnerInput.isVisible().catch(() => false)) {
        await partnerInput.fill('Partner Name');
      }
      await regEmailInput.fill('test@example.com');
      await regPasswordInput.fill('password123');
      await registerButton.click();
      await page.waitForTimeout(2000);
    }

    // 4. Capture Main Dashboard
    console.log('📸 Capturing: Main Dashboard...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-dashboard.png'),
      fullPage: true
    });
    console.log('✅ Saved: 02-dashboard.png\n');

    // 5. Capture Journal Page
    console.log('📸 Capturing: Journal Page...');
    await page.goto(`${BASE_URL}/journal`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-journal.png'),
      fullPage: true
    });
    console.log('✅ Saved: 03-journal.png\n');

    // Try to open new entry modal/form if it exists
    const newEntryButton = await page.locator('button:has-text("New Entry"), button:has-text("Add Entry"), button:has-text("Create")').first();
    if (await newEntryButton.isVisible().catch(() => false)) {
      await newEntryButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '03b-journal-new-entry.png'),
        fullPage: true
      });
      console.log('✅ Saved: 03b-journal-new-entry.png\n');

      // Close modal if there's a close button
      const closeButton = await page.locator('button:has-text("Cancel"), button:has-text("Close"), [aria-label="Close"]').first();
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }

    // 6. Capture Memories Page
    console.log('📸 Capturing: Memories Page...');
    await page.goto(`${BASE_URL}/memories`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-memories.png'),
      fullPage: true
    });
    console.log('✅ Saved: 04-memories.png\n');

    // 7. Capture Gratitude Page
    console.log('📸 Capturing: Gratitude Page...');
    await page.goto(`${BASE_URL}/gratitude`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-gratitude.png'),
      fullPage: true
    });
    console.log('✅ Saved: 05-gratitude.png\n');

    // 8. Capture Goals Page
    console.log('📸 Capturing: Goals Page...');
    await page.goto(`${BASE_URL}/goals`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-goals.png'),
      fullPage: true
    });
    console.log('✅ Saved: 06-goals.png\n');

    // 9. Capture Questions Page
    console.log('📸 Capturing: Questions Page...');
    await page.goto(`${BASE_URL}/questions`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-questions.png'),
      fullPage: true
    });
    console.log('✅ Saved: 07-questions.png\n');

    // Try to interact with questions if there are any
    const questionCard = await page.locator('[class*="question"], [class*="card"]').first();
    if (await questionCard.isVisible().catch(() => false)) {
      await questionCard.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '07b-questions-detail.png'),
        fullPage: true
      });
      console.log('✅ Saved: 07b-questions-detail.png\n');
    }

    // 10. Mobile Screenshots
    console.log('\n📱 Switching to mobile viewport...\n');
    await context.setViewportSize(MOBILE_VIEWPORT);

    // Mobile - Login
    console.log('📸 Capturing: Mobile Login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08-mobile-login.png'),
      fullPage: true
    });
    console.log('✅ Saved: 08-mobile-login.png\n');

    // Mobile - Dashboard
    console.log('📸 Capturing: Mobile Dashboard...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '09-mobile-dashboard.png'),
      fullPage: true
    });
    console.log('✅ Saved: 09-mobile-dashboard.png\n');

    // Mobile - Journal
    console.log('📸 Capturing: Mobile Journal...');
    await page.goto(`${BASE_URL}/journal`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '10-mobile-journal.png'),
      fullPage: true
    });
    console.log('✅ Saved: 10-mobile-journal.png\n');

    // Mobile - Questions
    console.log('📸 Capturing: Mobile Questions...');
    await page.goto(`${BASE_URL}/questions`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '11-mobile-questions.png'),
      fullPage: true
    });
    console.log('✅ Saved: 11-mobile-questions.png\n');

    console.log('\n✨ Screenshot capture completed successfully!\n');
    console.log(`📁 All screenshots saved to: ${SCREENSHOTS_DIR}\n`);

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

// Run the script
captureScreenshots().catch(console.error);
