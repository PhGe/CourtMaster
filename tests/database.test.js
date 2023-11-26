const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');

const PAGE_URL = 'https://phge.github.io/CourtMaster/';
const DATABASE_URL = 'postgres://dyjfpsho:a0N5GKX2kyBNAZ68w8Gpaw8AsGShUH6j@flora.db.elephantsql.com/dyjfpsho';

test('Check Database User - Philipp Admin', async ({ page }) => {
    // Database connection pool
    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    try {
        // Fetch data from the database for the specific user (Philipp - Admin)
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND role = $2', ['Philipp', 'Admin']);
        const user = result.rows[0];

        // Go to the page
        await page.goto(PAGE_URL);

        // Perform your assertions
        await expect(user).toBeTruthy();
        console.log(user);

        console.log(`Before waitForSelector: ${user.username} - ${user.role}`);
        console.log(await page.evaluate(() => {
            console.log('Browser Console Output');
            return 'Done evaluating';
        }));
        

        // Wait for the element to be visible
        await page.waitForSelector(`text=/${user.username}/`, { timeout: 10000 });

        console.log(`After waitForSelector: ${user.username} - ${user.role}`);

        console.log(await page.innerHTML(`text=/${user.username}/`));
        await expect(page.locator(`text=/${user.username}/`)).toBeVisible();
    } finally {
        // Close the database connection pool
        await pool.end();
    }
});
