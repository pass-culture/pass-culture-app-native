import * as SentryModule from '@sentry/react-native'

import { waitFor } from 'tests/utils'

import { eventMonitoring } from '../services'

describe('eventMonitoring', () => {
  describe('init()', () => {
    it("should call sentry's init() when enabled", async () => {
      await eventMonitoring.init({ enabled: true })

      expect(SentryModule.init).toHaveBeenCalledTimes(1)
    })

    it("should NOT call sentry's init() when disabled", () => {
      eventMonitoring.init({ enabled: false })

      expect(SentryModule.init).not.toHaveBeenCalled()
    })

    it('should set additional context on initialisation', async () => {
      eventMonitoring.init({ enabled: true })

      await waitFor(() => {
        expect(SentryModule.configureScope).toHaveBeenCalledTimes(1)
      })
    })
  })
})
