import { isFeatureFlagActive } from 'libs/firebase/firestore/featureFlags/isFeatureFlagActive'
import { useGetFeatureFlagDocSnapshot } from 'libs/firebase/firestore/featureFlags/useGetFeatureFlagDocSnapshot'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

// firestore feature flag documentation:
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useFeatureFlag = (featureFlag: RemoteStoreFeatureFlags): boolean => {
  const docSnapshot = useGetFeatureFlagDocSnapshot()

  return isFeatureFlagActive(featureFlag, docSnapshot)
}
