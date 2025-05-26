import { BrowserOptions } from '@sentry/react'

import { env } from 'libs/environment/env'
import { browserTracingIntegration } from 'libs/monitoring/sentry.web'

export async function getSentryConfig() {
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    // Since we are using the sentryVitePlugin we omit release & dist here.
    // Otherwise we would have to make sure both configs perfectly mirror each other.
    integrations: [browserTracingIntegration()],
    tracesSampleRate: Number(env.SENTRY_TRACES_SAMPLE_RATE || 1),
    sampleRate: Number(env.SENTRY_SAMPLE_RATE || 1),
    ignoreErrors: [
      'Non-Error promise rejection captured with value: Timeout', // Sentry Issue: APPLICATION-NATIVE-77ZQ
    ],
  } satisfies BrowserOptions
}
