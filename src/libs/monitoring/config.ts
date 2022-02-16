import { env } from 'libs/environment'

import { version, build } from '../../../package.json'

export const SENTRY_CONFIG = {
  dsn: env.SENTRY_DSN,
  environment: __DEV__ ? 'development' : env.ENV,
  release: version,
  dist: `${build}`,
  tracesSampleRate: 0.01,
}
