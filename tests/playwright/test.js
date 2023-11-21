const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://phge.github.io/CourtMaster/');

  const checkText = 'Welcome';
  await page.expect(checkText).toBeTruthy();

  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
