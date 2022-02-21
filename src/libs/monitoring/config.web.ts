import { Integrations } from '@sentry/tracing'

import { env } from 'libs/environment'

import { version, build } from '../../../package.json'

export async function getSentryConfig() {
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    // for testing, we want to group the source map under one artifact and select sourcemaps using hash
    release: env.ENV === 'testing' ? `${version}-web` : `${version}-web-${env.COMMIT_HASH}`,
    dist: env.ENV === 'testing' ? `${build}-web-${env.COMMIT_HASH}` : `${build}-web`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.01,
  }
}
