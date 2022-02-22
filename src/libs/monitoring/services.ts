import { CaptureContext, User, Event, Severity } from '@sentry/types'

import { getSentryConfig } from 'libs/monitoring/config'

import * as SentryModule from './sentry'

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
  async init({ enabled } = { enabled: true }) {
    if (!enabled) return
    const config = await getSentryConfig()
    SentryModule.init(config)
  },
}
