import { useQuery } from 'react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FeatureFlagConfig } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getAppBuildVersion } from 'libs/packageJson'

const isFeatureFlagActive = (
  featureFlagConfig: FeatureFlagConfig | undefined,
  appBuildVersion: number
): boolean => {
  if (!featureFlagConfig) return false

  const { minimalBuildNumber, maximalBuildNumber } = featureFlagConfig
  return (
    (!minimalBuildNumber || minimalBuildNumber <= appBuildVersion) &&
    (!maximalBuildNumber || maximalBuildNumber >= appBuildVersion)
  )
}

export const useFeatureFlagAll = () => {
  const appBuildVersion = getAppBuildVersion()
  const {
    data: docSnapshot,
    isLoading,
    error,
  } = useQuery('FEATURE_FLAGS', getAllFeatureFlags, { staleTime: 1000 * 30 })

  if (!docSnapshot || isLoading || error) {
    return {}
  }

  const featureFlags = Object.values(RemoteStoreFeatureFlags).reduce(
    (flags, key) => {
      const config = docSnapshot.get<FeatureFlagConfig>(key)
      flags[key] = isFeatureFlagActive(config, appBuildVersion)
      return flags
    },
    {} as Record<RemoteStoreFeatureFlags, boolean>
  )

  return featureFlags
}
