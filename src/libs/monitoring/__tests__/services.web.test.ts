import * as SentryModule from '@sentry/react'
import { Platform } from 'react-native'

import { env } from 'libs/environment'
import { getAppBuildVersion, getAppVersion } from 'libs/packageJson'

import { eventMonitoring } from '../services'

describe('eventMonitoring', () => {
  describe('init()', () => {
    it("should call sentry's init() when enabled", async () => {
      await eventMonitoring.init({ enabled: true })

      expect(SentryModule.init).toHaveBeenCalledWith({
        dsn: env.SENTRY_DSN,
        environment: 'development',
        release: `${getAppVersion()}-${Platform.OS}`,
        dist: `${getAppBuildVersion()}-web-13371337`,
        integrations: [expect.anything()],
        tracesSampleRate: 0.01,
      })
    })

    it("should NOT call sentry's init() when disabled", () => {
      eventMonitoring.init({ enabled: false })

      expect(SentryModule.init).not.toHaveBeenCalled()
    })
  })
})
