import { IdCheckErrorMonitoringInterface } from '@pass-culture/id-check'
import * as SentryModule from '@sentry/react-native'
import { CaptureContext, User, Event, Severity } from '@sentry/types'

import { env } from 'libs/environment'

import { version } from '../../../package.json'

export const errorMonitoring: IdCheckErrorMonitoringInterface<
  SentryModule.Scope,
  User,
  CaptureContext,
  Event,
  Severity
> = {
  captureException: SentryModule.captureException,
  captureMessage: SentryModule.captureMessage,
  captureEvent: SentryModule.captureEvent,
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
