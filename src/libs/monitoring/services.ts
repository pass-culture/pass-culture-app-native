import { User, Breadcrumb, Hub } from '@sentry/types'
import { Platform } from 'react-native'

import { getSentryConfig } from 'libs/monitoring/config'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'

import {
  addBreadcrumb,
  captureException,
  configureScope,
  init,
  setExtras,
  setUser,
  withProfiler,
  wrap,
} from './sentry'

type EventMonitoring = {
  addBreadcrumb: (breadcrumb: Breadcrumb) => ReturnType<Hub['addBreadcrumb']>
  captureException: typeof captureException
  configureScope: typeof configureScope
  init: ({ enabled }: { enabled: boolean }) => Promise<void>
  setUser: (user: User | Record<string, unknown> | null) => void
  setExtras: typeof setExtras
  withProfiler: typeof withProfiler
  wrap: typeof wrap
}

export const eventMonitoring: EventMonitoring = {
  addBreadcrumb: addBreadcrumb,
  captureException: captureException,
  configureScope: configureScope,
  setUser: setUser,
  setExtras: setExtras,
  withProfiler: withProfiler,
  wrap: wrap,
  async init({ enabled } = { enabled: true }) {
    if (!enabled) return
    const config = await getSentryConfig()
    init(config)
    configureScope(async (scope) => {
      scope.setExtras({ platform: Platform.OS, deviceId: await getDeviceId() })
    })
  },
}
