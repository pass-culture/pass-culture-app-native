import { isFeatureFlagEnabled } from 'libs/firebase/firestore/featureFlags/isFeatureFlagEnabled'
import { getAppBuildVersion } from 'libs/packageJson'

describe('featureFlagUtils', () => {
  const appVersion = getAppBuildVersion()

  it('should return wether feature flag is enabled or not', () => {
    expect(isFeatureFlagEnabled({ minimalBuildNumber: appVersion - 1 })).toBe(true)
    expect(isFeatureFlagEnabled({ minimalBuildNumber: appVersion + 1 })).toBe(false)
    expect(isFeatureFlagEnabled({ minimalBuildNumber: appVersion })).toBe(true)

    expect(isFeatureFlagEnabled({ maximalBuildNumber: appVersion - 1 })).toBe(false)
    expect(isFeatureFlagEnabled({ maximalBuildNumber: appVersion + 1 })).toBe(true)
    expect(isFeatureFlagEnabled({ maximalBuildNumber: appVersion })).toBe(true)

    expect(
      isFeatureFlagEnabled({ minimalBuildNumber: appVersion, maximalBuildNumber: appVersion })
    ).toBe(true)
  })

  it('should return false if config object is not defined', () => {
    expect(isFeatureFlagEnabled()).toBe(false)
  })

  it('should return false if config is malformed or build numbers are inconsistent', () => {
    expect(
      isFeatureFlagEnabled({
        minimalBuildNumber: Number.POSITIVE_INFINITY,
        maximalBuildNumber: appVersion,
      })
    ).toBe(false)
  })
})
