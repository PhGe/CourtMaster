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

        console.log(`Before waitForTimeout: ${user.username} - ${user.role}`);
        await page.waitForTimeout(5000); // Adjust the timeout as needed
        
        console.log(`After waitForTimeout: ${user.username} - ${user.role}`);
        
        const isElementVisible = await page.isVisible(`text=/${user.username}/`);
        
        console.log(`Is element visible: ${isElementVisible}`);
        
        if (!isElementVisible) {
            console.log(await page.innerHTML()); // Output the page content for further inspection
        }
        
        await expect(isElementVisible).toBe(true);
    } finally {
        // Close the database connection pool
        await pool.end();
    }
});
