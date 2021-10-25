import { env } from 'libs/environment'

import { version } from '../../../package.json'

export const SENTRY_CONFIG = {
  dsn: env.SENTRY_DSN,
  environment: env.ENV,
  release: version,
}
