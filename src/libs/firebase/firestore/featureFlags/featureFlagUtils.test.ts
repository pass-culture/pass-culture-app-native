import { isFeatureFlagEnabled } from 'libs/firebase/firestore/featureFlags/featureFlagUtils'
import { getAppBuildVersion } from 'libs/packageJson'

describe('featureFlagUtils', () => {
  const appVersion = getAppBuildVersion()

  it('should return wether feature flag is enabled or not', () => {
    expect(isFeatureFlagEnabled({ minimalBuildNumber: 0 })).toBe(true)
    expect(isFeatureFlagEnabled({ minimalBuildNumber: Number.POSITIVE_INFINITY })).toBe(false)
    expect(isFeatureFlagEnabled({ minimalBuildNumber: 0, maximalBuildNumber: appVersion })).toBe(
      true
    )
    expect(
      isFeatureFlagEnabled({
        minimalBuildNumber: appVersion,
        maximalBuildNumber: Number.POSITIVE_INFINITY,
      })
    ).toBe(true)
  })

  it('should return false if config object is not defined', () => {
    expect(isFeatureFlagEnabled()).toBe(false)
  })

  it('should throw an error if config is malformed or build numbers are inconsistent', () => {
    const data = { minimalBuildNumber: Number.POSITIVE_INFINITY, maximalBuildNumber: appVersion }

    expect(() => {
      isFeatureFlagEnabled({
        minimalBuildNumber: Number.POSITIVE_INFINITY,
        maximalBuildNumber: appVersion,
      })
    }).toThrow(new Error('BUILD_NUMBERS_ERROR', { cause: data }))
  })
})
