const { test, expect } = require('@playwright/test');
const {login} = require ('../tests/loginUtil')

  test('Check login', async ({ page }) => {
    await login(page);

    //get current URL
    const currentUrl = page.url();

    expect(currentUrl).toBe('https://phge.github.io/CourtMaster/#/subpage');
  });

