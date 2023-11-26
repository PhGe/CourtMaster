const { defineConfig } = require('@playwright/test');

export default defineConfig({
  retries: process.env.CI ? 2 : 0, // set to 2 when running on CI
  // ...
  use: {
    trace: 'on-first-retry', // record traces on first retry of each test
    headless: false,
  },
});

module.exports = {
  testMatch: ["**/tests/**/*.test.js"],
};
