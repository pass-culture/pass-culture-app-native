import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useFeatureFlag = (featureFlag: RemoteStoreFeatureFlags): boolean => {
  return useFeatureFlagOptions(featureFlag).isFeatureFlagActive
}
