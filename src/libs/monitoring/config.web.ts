import { Integrations } from '@sentry/tracing'

import { env } from 'libs/environment'
import { getAppBuildVersion, getAppVersion } from 'libs/packageJson'

export async function getSentryConfig() {
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    // for testing, we want to group the source map under one artifact and select sourcemaps using hash
    release:
      env.ENV === 'testing'
        ? `${getAppVersion()}-web`
        : `${getAppVersion()}-web-${String(env.COMMIT_HASH)}`,
    dist:
      env.ENV === 'testing'
        ? `${getAppBuildVersion()}-web-${String(env.COMMIT_HASH)}`
        : `${getAppBuildVersion()}-web`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE as unknown as number,
    sampleRate: env.SENTRY_SAMPLE_RATE as unknown as number,
  }
}
