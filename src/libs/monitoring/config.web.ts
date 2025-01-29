import { Integrations } from '@sentry/tracing'

import { env } from 'libs/environment/env'

export async function getSentryConfig() {
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    // Since we are using the sentryVitePlugin & release.uploadLegacySourcemaps option we omit release & dist here. Otherwise we would have to make sure both configs perfectly mirror each other.
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE as unknown as number,
    sampleRate: env.SENTRY_SAMPLE_RATE as unknown as number,
  }
}
