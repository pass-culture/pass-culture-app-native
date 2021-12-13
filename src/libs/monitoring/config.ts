import { env } from 'libs/environment'

import { version } from '../../../package.json'

export const SENTRY_CONFIG = {
  dsn: env.SENTRY_DSN,
  environment: __DEV__ ? 'development' : env.ENV,
  release: version,
  tracesSampleRate: 0.01,
}
