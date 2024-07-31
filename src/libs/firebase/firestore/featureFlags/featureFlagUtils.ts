import { FeatureFlagConfig } from 'libs/firebase/firestore/featureFlags/types'
import { getAppBuildVersion } from 'libs/packageJson'

const appBuildVersion = getAppBuildVersion()

export const isFeatureFlagEnabled = (featureFlagConfig: FeatureFlagConfig = {}) => {
  const { minimalBuildNumber, maximalBuildNumber } = featureFlagConfig
  if (minimalBuildNumber === undefined && maximalBuildNumber === undefined) return false

  if (!!(minimalBuildNumber && maximalBuildNumber) && minimalBuildNumber > maximalBuildNumber) {
    throw new Error('BUILD_NUMBERS_ERROR', {
      cause: {
        minimalBuildNumber,
        maximalBuildNumber,
      },
    })
  }

  return (
    (!minimalBuildNumber || minimalBuildNumber <= appBuildVersion) &&
    (!maximalBuildNumber || maximalBuildNumber >= appBuildVersion)
  )
}
