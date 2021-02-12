import * as SentryModule from '@sentry/react-native'

import { env } from 'libs/environment'

import { version } from '../../../package.json'

import { errorMonitoring } from '.'

afterEach(jest.clearAllMocks)

describe('errorMonitoring', () => {
  describe('init()', () => {
    it("should call sentry's init() when enabled", () => {
      errorMonitoring.init()
      expect(SentryModule.init).toBeCalledWith({
        dsn: env.SENTRY_DSN,
        environment: env.ENV,
        release: version,
      })
    })

    it("should NOT call sentry's init() when disabled", () => {
      errorMonitoring.init({ enabled: false })
      expect(SentryModule.init).not.toBeCalled()
    })
  })
})
