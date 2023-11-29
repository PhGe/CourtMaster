
const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');

const PAGE_URL = 'https://phge.github.io/CourtMaster/#/subpage';
const DATABASE_URL = 'postgres://dyjfpsho:a0N5GKX2kyBNAZ68w8Gpaw8AsGShUH6j@flora.db.elephantsql.com/dyjfpsho';

test('Check Database Users', async ({ page }) => {
   
    //database connection pool
    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    try {
        // Fetch data from the database
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;

        // Go to the page
        await page.goto(PAGE_URL);

        // Perform your assertions
        await expect(users).toBeTruthy();
        console.log(users)

        const pageContent = await page.content();
        console.log(pageContent);
        for (const user of users) {
            console.log(`Before waitForSelector: ${user.username} - ${user.role}`);

            await page.waitForSelector(`text=/${user.username}/`);

            console.log(`After waitForSelector: ${user.username} - ${user.role}`);

            console.log(await page.innerHTML(`text=/${user.username}/`));
            await expect(page.locator(`text=/${user.username}/`)).toBeVisible();
            const pageContent = await page.content();
            console.log(pageContent);
        }
    } finally {
        // Close the database connection pool
        await pool.end();
    }
});