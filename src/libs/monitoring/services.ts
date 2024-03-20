import { User, Breadcrumb, Hub } from '@sentry/types'
import { Platform } from 'react-native'

import { getSentryConfig } from 'libs/monitoring/config'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'

import * as SentryModule from './sentry'

type EventMonitoring = {
  addBreadcrumb: (breadcrumb: Breadcrumb) => ReturnType<Hub['addBreadcrumb']>
  logError: typeof SentryModule.captureException
  logInfo: typeof SentryModule.captureException
  configureScope: typeof SentryModule.configureScope
  init: ({ enabled }: { enabled: boolean }) => Promise<void>
  setUser: (user: User | Record<string, unknown> | null) => void
  setExtras: typeof SentryModule.setExtras
  startTransaction: typeof SentryModule.startTransaction
  withProfiler: typeof SentryModule.withProfiler
  wrap: typeof SentryModule.wrap
}

export const eventMonitoring: EventMonitoring = {
  addBreadcrumb: SentryModule.addBreadcrumb,
  logError: SentryModule.captureException,
  logInfo: (message, captureContext) =>
    SentryModule.captureException(message, { level: 'info', ...captureContext }),
  configureScope: SentryModule.configureScope,
  setUser: SentryModule.setUser,
  setExtras: SentryModule.setExtras,
  startTransaction: SentryModule.startTransaction,
  withProfiler: SentryModule.withProfiler,
  wrap: SentryModule.wrap,
  async init({ enabled } = { enabled: true }) {
    if (!enabled) return
    const config = await getSentryConfig()
    SentryModule.init(config)
    SentryModule.configureScope(async (scope) => {
      scope.setExtras({ platform: Platform.OS, deviceId: await getDeviceId() })
    })
  },
}
