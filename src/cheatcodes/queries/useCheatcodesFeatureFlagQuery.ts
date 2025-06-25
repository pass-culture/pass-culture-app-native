import { onlineManager, useQuery } from 'react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FeatureFlagConfig, squads } from 'libs/firebase/firestore/featureFlags/types'
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
  featureFlag: string
  isFeatureFlagActive: boolean // We don't use RemoteStoreFeatureFlags as we want FFs that are deleted from code
}

export const useCheatcodesFeatureFlagQuery = () => {
  const appBuildVersion = getAppBuildVersion()
  const {
    data: docSnapshot,
    isLoading,
    error,
  } = useQuery('FEATURE_FLAGS', getAllFeatureFlags, {
    staleTime: 1000 * 30,
    enabled: onlineManager.isOnline(),
  })

  if (!docSnapshot || isLoading || error) {
    return {}
  }

  const allFlagsData = docSnapshot.data()

  if (!allFlagsData) {
    return {}
  }

  const featureFlags = Object.entries(allFlagsData).reduce(
    (flags, [key, config]) => {
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
