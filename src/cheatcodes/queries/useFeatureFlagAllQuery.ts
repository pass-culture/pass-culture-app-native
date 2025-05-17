import { onlineManager, useQuery } from '@tanstack/react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FeatureFlagConfig, squads } from 'libs/firebase/firestore/featureFlags/types'
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

export type FeatureFlagAll = {
  featureFlag: RemoteStoreFeatureFlags
  isFeatureFlagActive: boolean
}

export const useFeatureFlagAllQuery = () => {
  const appBuildVersion = getAppBuildVersion()
  const {
    data: docSnapshot,
    isLoading,
    error,
  } = useQuery(['FEATURE_FLAGS'], getAllFeatureFlags, {
    staleTime: 1000 * 30,
    enabled: onlineManager.isOnline(),
  })

  if (!docSnapshot || isLoading || error) {
    return {}
  }

  const featureFlags = Object.values(RemoteStoreFeatureFlags).reduce(
    (flags, key) => {
      const config = docSnapshot.get<FeatureFlagConfig>(key)
      const owner = (config?.owner?.toLowerCase() as squads) ?? 'squad non-definie'
      if (!flags[owner]) {
        flags[owner] = []
      }
      flags[owner].push({
        featureFlag: key,
        isFeatureFlagActive: isFeatureFlagActive(config, appBuildVersion),
      })
      return flags
    },
    {} as Record<squads | 'squad non-definie', FeatureFlagAll[]>
  )

  return featureFlags
}
