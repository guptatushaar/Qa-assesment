// @ts-check
/**
 * Playwright config for Toolshop UI + API projects.
 * Purpose: serial workers + retries for the live demo SUT; reports + screenshots under execution-reports/.
 */
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 180 * 1000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  // Raw run artifacts (copied into screenshots/ by collectEvidence.js after the run).
  outputDir: 'execution-reports/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'execution-reports/html-report', open: 'never' }],
    ['json', { outputFile: 'execution-reports/results.json' }],
  ],
  use: {
    // Override with UI_BASE_URL when pointing at another environment.
    baseURL: process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com',
    trace: 'retain-on-failure',
    // Capture a screenshot at the end of every test (pass or fail) for assessment evidence.
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui-chromium',
      testDir: './tests/UI Test',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/API Test',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com',
        // API project has no page — screenshots are N/A.
        screenshot: 'off',
        video: 'off',
        trace: 'off',
      },
    },
  ],
});
