import { defineConfig } from '@playwright/test'

const runUrl =
  process.env.GITHUB_SERVER_URL &&
  `<${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}|Voir le run>`

export default defineConfig({
  testDir: './e2e/web',
  retries: process.env.CI ? 2 : 0,
  // #équipe-e2e-jeunes, same channel/bot token already used for other CI Slack notifications.
  reporter: process.env.CI
    ? [
        ['github'],
        [
          './node_modules/playwright-slack-report/dist/src/SlackReporter.js',
          {
            channels: ['C05MH81G9LY'],
            sendResults: 'always',
            slackLogLevel: 'error',
            meta: [
              { key: '🌿 Branche', value: process.env.GITHUB_REF_NAME ?? 'inconnue' },
              { key: '📁 Suite', value: 'e2e/web (smoke)' },
              ...(runUrl ? [{ key: '🔗 Détails', value: runUrl }] : []),
            ],
          },
        ],
      ]
    : 'list',
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
