import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/web',
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
  },
  webServer: {
    command: 'yarn start:web:staging --host 127.0.0.1',
    // Playwright's readiness probe checks '/' then falls back to '/index.html', neither served here
    // (Vite serves the app only at '/src/index.html', see vite.config.js createHtmlPlugin entry).
    url: 'http://127.0.0.1:5173/src/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
})
