import { env } from 'libs/environment/env'

import { getSentryConfig } from './config'

jest.mock('libs/packageJson', () => ({
  getAppVersion: jest.fn(() => '1.2.3'),
  getAppBuildVersion: jest.fn(() => '42'),
}))

describe('monitoring/config native', () => {
  it('should set profilesSampleRate at root level', () => {
    env.SENTRY_PROFILES_SAMPLE_RATE = '0.1'

    const config = getSentryConfig()

    expect(config).toEqual(expect.objectContaining({ profilesSampleRate: 0.1 }))
    expect(config).not.toHaveProperty('_experiments.profilesSampleRate')
  })
})
