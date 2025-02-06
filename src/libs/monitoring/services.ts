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
  startTransaction,
  withProfiler,
  wrap,
} from './sentry'

export const eventMonitoring = {
  addBreadcrumb,
  captureException,
  configureScope,
  setUser,
  setExtras,
  startTransaction,
  withProfiler,
  wrap,
  async init({ enabled } = { enabled: true }) {
    if (!enabled) return
    const config = await getSentryConfig()
    init(config)
    configureScope(async (scope) => {
      scope.setExtras({ platform: Platform.OS, deviceId: await getDeviceId() })
    })
  },
}
