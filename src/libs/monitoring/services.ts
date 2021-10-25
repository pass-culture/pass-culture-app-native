import { IdCheckErrorMonitoringInterface } from '@pass-culture/id-check'
import * as SentryModule from '@sentry/react-native'
import { CaptureContext, User, Event, Severity } from '@sentry/types'

import { SENTRY_CONFIG } from 'libs/monitoring/config'

type EventMonitoring = IdCheckErrorMonitoringInterface<
  SentryModule.Scope,
  User,
  CaptureContext,
  Event,
  Severity
>

export const eventMonitoring: EventMonitoring = {
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
