import { env } from 'libs/environment/env'

import { getSentryConfig } from './config'

jest.mock('libs/packageJson', () => ({
  getAppVersion: jest.fn(() => '1.2.3'),
  getAppBuildVersion: jest.fn(() => '42'),
}))

describe('monitoring/config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return config object with correct sample rates as set in env variables', async () => {
    env.SENTRY_SAMPLE_RATE = '0.5'
    env.SENTRY_TRACES_SAMPLE_RATE = '0.25'
    env.SENTRY_DSN = 'http://sentry.dsn'

    const config = await getSentryConfig()

    expect(config).toEqual(
      expect.objectContaining({
        sampleRate: 0.5,
        tracesSampleRate: 0.25,
        dsn: 'http://sentry.dsn',
      })
    )
  })

  it('should return config object with default sample rates if env variables are falsy', async () => {
    env.SENTRY_SAMPLE_RATE = ''
    env.SENTRY_TRACES_SAMPLE_RATE = ''
    env.SENTRY_DSN = ''

    const config = await getSentryConfig()

    expect(config).toEqual(
      expect.objectContaining({
        sampleRate: 1,
        tracesSampleRate: 1,
        dsn: '',
      })
    )
  })
})
