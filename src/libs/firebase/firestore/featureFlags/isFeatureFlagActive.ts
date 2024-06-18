import { FeatureFlagConfig, FeatureFlagDocument } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring'
import { getAppBuildVersion } from 'libs/packageJson'

const appBuildVersion = getAppBuildVersion()

export const isFeatureFlagActive = (
  featureFlag: RemoteStoreFeatureFlags | keyof typeof RemoteStoreFeatureFlags,
  featureFlagDocument?: FeatureFlagDocument | null
) => {
  if (!featureFlagDocument) {
    return false
  }

  const remoteStoreFeatureFlag: RemoteStoreFeatureFlags = isStringKeyOfRemoteStoreFeatureFlags(
    featureFlag
  )
    ? RemoteStoreFeatureFlags[featureFlag]
    : featureFlag

  const { minimalBuildNumber, maximalBuildNumber } =
    featureFlagDocument.get<FeatureFlagConfig>(remoteStoreFeatureFlag) ?? {}

  if (minimalBuildNumber === undefined && maximalBuildNumber === undefined) return false

  if (!!(minimalBuildNumber && maximalBuildNumber) && minimalBuildNumber > maximalBuildNumber) {
    eventMonitoring.captureException(
      `Minimal build number is greater than maximal build number for feature flag ${featureFlag}`,
      {
        level: 'info',
        extra: {
          minimalBuildNumber,
          maximalBuildNumber,
        },
      }
    )
    return false
  }
  return (
    (!minimalBuildNumber || minimalBuildNumber <= appBuildVersion) &&
    (!maximalBuildNumber || maximalBuildNumber >= appBuildVersion)
  )
}

const isStringKeyOfRemoteStoreFeatureFlags = (
  key: string
): key is keyof typeof RemoteStoreFeatureFlags => key in RemoteStoreFeatureFlags
