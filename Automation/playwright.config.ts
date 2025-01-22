import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'ng serve', // Adjust this command if needed
    url: 'http://localhost:4200', // URL where your Angular app runs
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Give some extra time to ensure the server starts
  },
});
