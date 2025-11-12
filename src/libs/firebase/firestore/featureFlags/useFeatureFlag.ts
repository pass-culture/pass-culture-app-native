import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useFeatureFlag = (featureFlag: RemoteStoreFeatureFlags): boolean => {
  return useFeatureFlagOptionsQuery(featureFlag).isFeatureFlagActive
}
