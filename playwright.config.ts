import { defineConfig } from '@playwright/test'

const runUrl =
  process.env.GITHUB_SERVER_URL &&
  `<${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}|Voir le run>`

export default defineConfig({
  testDir: './e2e/web',
  retries: process.env.CI ? 2 : 0,
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
              { key: '📁 Suite', value: process.env.E2E_SUITE_LABEL ?? 'inconnue' },
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
    // Vite only serves the app at '/src/index.html', not '/' or '/index.html'.
    url: 'http://127.0.0.1:5173/src/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
})
