import { onlineManager, useQuery } from 'react-query'

import { getAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/getAllFeatureFlags'
import { FeatureFlagConfig, squads } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { isFeatureFlagActive } from 'shared/featureflag/isFeatureFlagActive'

export type FeatureFlagAll = {
  featureFlag: RemoteStoreFeatureFlags
  isFeatureFlagActive: boolean
}

export const useFeatureFlagAllQuery = () => {
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

  const featureFlags = Object.values(RemoteStoreFeatureFlags).reduce(
    (flags, key) => {
      const config = docSnapshot.get<FeatureFlagConfig>(key)
      const owner = (config?.owner?.toLowerCase() as squads) ?? 'squad non-definie'
      if (!flags[owner]) {
        flags[owner] = []
      }
      flags[owner].push({
        featureFlag: key,
        isFeatureFlagActive: isFeatureFlagActive(key),
      })
      return flags
    },
    {} as Record<squads | 'squad non-definie', FeatureFlagAll[]>
  )

  return featureFlags
}
