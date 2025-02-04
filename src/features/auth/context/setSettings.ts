import { SettingsResponse } from 'api/gen'
import * as useSettingsModule from 'features/auth/context/useSettings'
import { defaultSettings } from 'features/auth/fixtures/fixtures'

export const setSettings = (settings: Partial<SettingsResponse> = {}) => {
  const useSettingsContextSpy = jest.spyOn(useSettingsModule, 'useSettings')
  useSettingsContextSpy.mockImplementation(() => ({
    data: { ...defaultSettings, ...settings },
    isLoading: false,
  }))
}

// import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
// import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

// export const setFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
//   const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')
//   useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
// }
