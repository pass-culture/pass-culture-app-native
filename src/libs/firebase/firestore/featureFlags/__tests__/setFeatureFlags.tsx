import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const setFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
