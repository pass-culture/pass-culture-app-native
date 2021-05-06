import { IdCheckErrorMonitoringInterface } from '@pass-culture/id-check'
import SentryModule, { Scope } from '@sentry/react-native'
import { CaptureContext, User } from '@sentry/types'

import { env } from 'libs/environment'

import { version } from '../../../package.json'

export const errorMonitoring: IdCheckErrorMonitoringInterface<Scope, User, CaptureContext> = {
  captureException: SentryModule.captureException,
  configureScope: SentryModule.configureScope,
  init,
  setUser: SentryModule.setUser,
}

function init({ enabled } = { enabled: true }) {
  if (!enabled) return

  SentryModule.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENV,
    release: version,
  })
}
