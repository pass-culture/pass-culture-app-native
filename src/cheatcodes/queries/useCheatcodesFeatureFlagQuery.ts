import { onlineManager, useQuery } from 'react-query'

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
  featureFlag: string
  isFeatureFlagActive: boolean
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

  const knownFlags = new Set(Object.values(RemoteStoreFeatureFlags))

  const featureFlags = Object.entries(allFlagsData).reduce(
    (flags, [key, config]) => {
      const isKnownFlag = knownFlags.has(key as RemoteStoreFeatureFlags)

      // Determine the owner. If the flag is not known, assign it to the special category 'not used in code'.
      // Otherwise, use its real owner from the config.
      const owner = isKnownFlag
        ? ((config?.owner?.toLowerCase() as squads) ?? 'squad non-definie')
        : 'not used in code'

      if (!flags[owner]) {
        flags[owner] = []
      }

      flags[owner].push({
        featureFlag: key,
        isFeatureFlagActive: isFeatureFlagActive(config, appBuildVersion),
      })
      return flags
    },
    {} as Record<squads | 'squad non-definie' | 'removed from code', FeatureFlagAll[]>
  )

  return featureFlags
}
