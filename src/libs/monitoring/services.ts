import { IdCheckErrorMonitoringInterface } from '@pass-culture/id-check'
import * as SentryModule from '@sentry/react-native'
import { CaptureContext, User, Event, Severity } from '@sentry/types'

import { env } from 'libs/environment'

import { version } from '../../../package.json'

const SENTRY_CONFIG = {
  dsn: env.SENTRY_DSN,
  environment: env.ENV,
  release: version,
}

type ErrorMonitoring = IdCheckErrorMonitoringInterface<
  SentryModule.Scope,
  User,
  CaptureContext,
  Event,
  Severity
>

export const errorMonitoring: ErrorMonitoring = {
  captureException: SentryModule.captureException,
  captureMessage: SentryModule.captureMessage,
  captureEvent: SentryModule.captureEvent,
  configureScope: SentryModule.configureScope,
  setUser: SentryModule.setUser,
  init({ enabled } = { enabled: true }) {
    if (!enabled) return
    SentryModule.init(SENTRY_CONFIG)
  },
}
