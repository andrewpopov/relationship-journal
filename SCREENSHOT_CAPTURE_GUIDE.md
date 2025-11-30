# Screenshot Capture Guide

This guide explains how to capture comprehensive screenshots of the Relationship Journal application for quality evaluation.

## Quick Start

1. **Install Playwright** (one-time setup):
   ```bash
   npm install
   npx playwright install chromium
   ```

2. **Ensure the application is running**:
   ```bash
   # In one terminal, start the backend
   npm run dev:backend

   # In another terminal, start the frontend
   npm run dev:frontend
   ```

3. **Run the screenshot capture script**:
   ```bash
   npm run capture-screenshots
   ```

All screenshots will be saved to the `screenshots/` directory.

## What Gets Captured

The script automatically captures:

### Desktop Views (1920x1080)
1. **01-landing-login.png** - Initial login page
2. **01b-register.png** - Registration page
3. **01c-login-filled.png** - Login form with test credentials
4. **02-dashboard.png** - Main dashboard after login
5. **03-journal.png** - Journal entries page
6. **03b-journal-new-entry.png** - New journal entry modal/form
7. **04-memories.png** - Memories/photos section
8. **05-gratitude.png** - Gratitude prompts page
9. **06-goals.png** - Goals section
10. **07-questions.png** - Questions feature page
11. **07b-questions-detail.png** - Question detail/interaction

### Mobile Views (375x667)
12. **08-mobile-login.png** - Mobile login view
13. **09-mobile-dashboard.png** - Mobile dashboard
14. **10-mobile-journal.png** - Mobile journal view
15. **11-mobile-questions.png** - Mobile questions view

## Manual Screenshot Capture

If you prefer to capture screenshots manually or need additional specific captures:

1. **Open the application** in your browser at http://localhost:5173
2. **Use browser DevTools**:
   - Press F12 to open DevTools
   - Click the device toolbar icon (or press Ctrl+Shift+M)
   - Select viewport size (1920x1080 for desktop, 375x667 for mobile)
   - Take screenshots using your OS screenshot tool or browser screenshot feature

### Recommended Manual Captures

- **Error states**: Try invalid login, empty forms, failed submissions
- **Loading states**: Capture moments when data is being fetched
- **Hover states**: Hover over buttons and interactive elements
- **Form validation**: Submit forms with invalid data
- **Modal dialogs**: Open and capture any modal windows
- **Empty states**: Capture pages with no data (new user experience)

## Screenshot Naming Convention

Use descriptive filenames that follow this pattern:
- `{number}-{page}-{state}.png`
- Examples:
  - `12-journal-error-empty-title.png`
  - `13-dashboard-hover-nav-item.png`
  - `14-memories-upload-modal.png`

## Customizing the Script

### Change Viewport Sizes

Edit `capture-screenshots.js` and modify these constants:
```javascript
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };
```

### Add Tablet Viewport

Add this constant:
```javascript
const TABLET_VIEWPORT = { width: 768, height: 1024 };
```

Then add tablet captures in the script:
```javascript
await context.setViewportSize(TABLET_VIEWPORT);
// Add your screenshot captures here
```

### Change Test Credentials

In the script, find and modify:
```javascript
await emailInput.fill('test@example.com');
await passwordInput.fill('password123');
```

### Capture Additional Pages

Add new screenshot captures by following this pattern:
```javascript
console.log('📸 Capturing: Your Page Name...');
await page.goto(`${BASE_URL}/your-route`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({
  path: path.join(SCREENSHOTS_DIR, 'XX-your-page.png'),
  fullPage: true
});
console.log('✅ Saved: XX-your-page.png\n');
```

## Troubleshooting

### Script Fails During Login

If the script can't log in automatically:
1. Check if test credentials exist in the database
2. Or, register manually first with email: `test@example.com` and password: `password123`
3. Then run the script again

### Screenshots are Blank or Incomplete

- Increase wait times in the script:
  ```javascript
  await page.waitForTimeout(2000); // Increase from 1000 to 2000
  ```
- Check if the application is fully loaded before capture
- Ensure backend is running and responding

### Browser Doesn't Close

- The script runs in non-headless mode so you can see what's happening
- Browser will close automatically when complete
- To run in headless mode, change:
  ```javascript
  const browser = await chromium.launch({ headless: true });
  ```

## Screenshot Quality Tips

1. **Clear test data**: Start with a clean or predictable database state
2. **Consistent timing**: Always wait for animations and transitions to complete
3. **Full page captures**: Use `fullPage: true` for pages with scrolling content
4. **Network idle**: Use `waitUntil: 'networkidle'` to ensure all resources are loaded
5. **Multiple states**: Capture both empty and populated states of lists and forms

## Next Steps

After capturing screenshots:
1. Review each screenshot for quality and completeness
2. Create a comparison document showing before/after states
3. Use screenshots for bug reports, documentation, or design reviews
4. Archive screenshots with version tags for future reference

## Support

For issues or questions about screenshot capture:
- Check the Playwright documentation: https://playwright.dev
- Review the script code in `capture-screenshots.js`
- Adjust wait times and selectors as needed for your specific setup
