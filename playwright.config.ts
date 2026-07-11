import { defineConfig, devices } from '@playwright/test';

// El e2e corre contra `astro preview` (post-build): lo que se valida es el
// HTML estático real que servirá Netlify, no el dev server.
export default defineConfig({
  testDir: 'e2e',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:4321' },
});
