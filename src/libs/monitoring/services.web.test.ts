import * as SentryModule from '@sentry/react'

import { env } from 'libs/environment/env'

import { eventMonitoring } from './services'

describe('eventMonitoring', () => {
  describe('init()', () => {
    it("should call sentry's init() when enabled", async () => {
      await eventMonitoring.init({ enabled: true })

      expect(SentryModule.init).toHaveBeenCalledWith({
        dsn: env.SENTRY_DSN,
        environment: 'development',
        integrations: [expect.anything()],
        tracesSampleRate: '1.0',
        sampleRate: '1.0',
        ignoreErrors: ['Non-Error promise rejection captured with value: Timeout'],
      })
    })

    it("should NOT call sentry's init() when disabled", () => {
      eventMonitoring.init({ enabled: false })

      expect(SentryModule.init).not.toHaveBeenCalled()
    })
  })
})
