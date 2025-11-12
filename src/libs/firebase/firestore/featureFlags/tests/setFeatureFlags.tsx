import * as useFeatureFlagOptionsAPI from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type ActiveFeatureFlag = {
  featureFlag: RemoteStoreFeatureFlags
  options: Record<string, unknown>
}

type ActiveFeatureFlags = (RemoteStoreFeatureFlags | ActiveFeatureFlag)[]

export const setFeatureFlags = (activeFeatureFlags: ActiveFeatureFlags = []) => {
  const useFeatureFlagSpy = jest.spyOn(useFeatureFlagOptionsAPI, 'useFeatureFlagOptionsQuery')
  useFeatureFlagSpy.mockImplementation((flag): useFeatureFlagOptionsAPI.FeatureFlagOptions => {
    const featureFlagRecord = activeFeatureFlags.find(
      (item) => typeof item === 'object' && flag === item.featureFlag
    )
    return {
      isFeatureFlagActive: activeFeatureFlags.includes(flag) || !!featureFlagRecord,
      options: typeof featureFlagRecord === 'object' ? featureFlagRecord.options : undefined,
    }
  })
}
