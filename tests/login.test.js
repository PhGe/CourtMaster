const { test, expect } = require('@playwright/test');
const {login} = require ('../src/utils/loginUtil')

  test('Check login', async ({ page }) => {
    await login(page); 
    await page.waitForTimeout(1500);    

    //get current URL
    const currentUrl = page.url();

    expect(currentUrl).toBe('https://phge.github.io/CourtMaster/#/subpage');
  });

