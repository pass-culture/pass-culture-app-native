import { Integrations } from '@sentry/tracing'

import { env } from 'libs/environment'

import { version, build } from '../../../package.json'

export async function getSentryConfig() {
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    release: version,
    dist: env.ENV === 'testing' ? `${build}-web-${env.COMMIT_HASH}` : `${build}-web`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.01,
  }
}
