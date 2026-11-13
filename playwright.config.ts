import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'

import { generateBuildSummary } from './e2e/web/slackLayout'

dotenv.config({ path: 'e2e/web/.env.secret' })

const runUrl =
  process.env.GITHUB_SERVER_URL &&
  `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`

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
          layout: generateBuildSummary,
          meta: [
            { key: 'Branche', value: process.env.GITHUB_REF_NAME ?? 'inconnue' },
            { key: 'Suite', value: process.env.E2E_SUITE_LABEL ?? 'inconnue' },
            ...(runUrl ? [{ key: 'Run', value: runUrl }] : []),
          ],
        },
      ],
    ]
    : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Empty API_BASE_URL keeps API calls relative so the preview proxy avoids CORS on 127.0.0.1.
    command:
      'API_BASE_URL= yarn build:staging && yarn preview:web:staging --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 300000,
  },
})
