import * as useFeatureFlagOptionsAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const setFeatureFlags = (
  activeFeatureFlags: RemoteStoreFeatureFlags[] = [],
  options?: Record<string, unknown>
) => {
  const useFeatureFlagSpy = jest.spyOn(useFeatureFlagOptionsAPI, 'useFeatureFlagOptions')
  useFeatureFlagSpy.mockImplementation((flag) => ({
    isFeatureFlagActive: activeFeatureFlags.includes(flag),
    options,
  }))
}
