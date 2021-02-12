import * as SentryModule from '@sentry/react-native'

import { env } from 'libs/environment'

import { version } from '../../../package.json'

export const errorMonitoring = {
  captureException: SentryModule.captureException,
  init,
}

function init({ enabled } = { enabled: true }) {
  if (!enabled) {
    return
  }
  SentryModule.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENV,
    release: version,
  })
}
