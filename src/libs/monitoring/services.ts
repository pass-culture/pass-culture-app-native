import * as SentryModule from '@sentry/react-native'
import { CaptureContext, User, Event, Severity } from '@sentry/types'

import { SENTRY_CONFIG } from 'libs/monitoring/config'

type EventMonitoring = {
  captureException: (
    exception: unknown,
    captureContext?: CaptureContext | Record<string, unknown>
  ) => void
  captureEvent: (event: Event | Record<string, unknown>) => void
  captureMessage: (
    message: string,
    captureContext?: CaptureContext | Record<string, unknown> | Severity
  ) => void
  configureScope: (callback: (scope: SentryModule.Scope) => void) => void
  init: ({ enabled }: { enabled: boolean }) => void
  setUser: (user: User | Record<string, unknown> | null) => void
}

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
