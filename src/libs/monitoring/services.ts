import { Platform } from 'react-native'

import { getSentryConfig } from 'libs/monitoring/config'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'

import { addBreadcrumb, captureException, init, setExtras, setUser } from './sentry'

export const eventMonitoring = {
  addBreadcrumb,
  captureException,
  setUser,
  setExtras,
  async init({ enabled = true } = {}) {
    if (!enabled) return
    const config = await getSentryConfig()
    init(config)
    setExtras({ platform: Platform.OS, deviceId: await getDeviceId() })
  },
}
