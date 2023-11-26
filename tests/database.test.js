const { test, expect } = require('@playwright/test');

const PAGE_URL = 'https://phge.github.io/CourtMaster/';

test('Check Database Users', async ({ page }) => {

    //fetch backend
    const userResponse = await fetch('http://localhost:3000/users/v1')
    const users = await userResponse.json();


    //goto Page
    await page.goto(PAGE_URL);
  
    await expect(users).toBeTruthy();
    
    //check if loaded successfully
    for (const user of users) {
        await expect(page.locator(`text=${user.username} - ${user.role}`)).toBeVisible();
    }
  });



