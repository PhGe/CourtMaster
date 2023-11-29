const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');


const PAGE_URL = 'https://phge.github.io/CourtMaster/';
const checkText = 'Welcome';
const currentDate = new Date().toISOString().replace(/:/g, '-').substring(0, 19);

test('Verify Welcome Text', async ({ page }) => {
  await page.goto(PAGE_URL);

  await expect(checkText).toBeTruthy();

  await expect(page.locator(`text=${checkText}`)).toBeVisible();

  const screenshotsDir = path.join(__dirname, 'Screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const screenshotPath = path.join(screenshotsDir, `screenshot_${currentDate}.png`);

  await page.screenshot({ path: screenshotPath  });

});
