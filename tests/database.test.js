const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');

const PAGE_URL = 'https://phge.github.io/CourtMaster/';
const DATABASE_URL = 'postgres://dyjfpsho:a0N5GKX2kyBNAZ68w8Gpaw8AsGShUH6j@flora.db.elephantsql.com/dyjfpsho';

test('Check if "Philipp" exists on the site', async ({ page }) => {
    // Database connection pool
    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    try {
        // Go to the page
        await page.goto(PAGE_URL);

        // Get the content of the page
        const pageContent = await page.content();

        // Perform your assertion
        await expect(pageContent).toContain('Philipp');
    } finally {
        // Close the database connection pool
        await pool.end();
    }
});
