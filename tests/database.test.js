const { test, expect } = require('@playwright/test');
const { Pool } = require('pg');

const PAGE_URL = 'https://phge.github.io/CourtMaster/';
const DATABASE_URL = 'postgres://dyjfpsho:a0N5GKX2kyBNAZ68w8Gpaw8AsGShUH6j@flora.db.elephantsql.com/dyjfpsho';

test('Check if "Philipp" exists on the site', async () => {
    // Database connection pool
    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    const browser = await require('playwright').chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Go to the page
        await page.goto(PAGE_URL);

        // Get the content of the page
        const pageContent = await page.content();
        console.log(pageContent);

        // Perform your assertion
        await expect(pageContent).toContain('Philipp');
    } finally {
        // Close the database connection pool
        await pool.end();
        await browser.close();
    }
});