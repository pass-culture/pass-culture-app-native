import { BrowserOptions } from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { env } from 'libs/environment/env'

export async function getSentryConfig() {
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    // Since we are using the sentryVitePlugin & release.uploadLegacySourcemaps option we omit release & dist here. Otherwise we would have to make sure both configs perfectly mirror each other.
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: Number(env.SENTRY_TRACES_SAMPLE_RATE || 1),
    sampleRate: Number(env.SENTRY_SAMPLE_RATE || 1),
    ignoreErrors: [
      'Non-Error promise rejection captured with value: Timeout', // Sentry Issue: APPLICATION-NATIVE-77ZQ
    ],
  } satisfies BrowserOptions
}
