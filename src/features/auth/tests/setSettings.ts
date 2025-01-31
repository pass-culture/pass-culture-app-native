import { SettingsResponse } from 'api/gen'
import * as useSettingsModule from 'features/auth/context/useSettings'
import { defaultSettings } from 'features/auth/fixtures/fixtures'

export const setSettings = (settings: Partial<SettingsResponse> = {}) => {
  const useSettingsSpy = jest.spyOn(useSettingsModule, 'useSettings')
  useSettingsSpy.mockImplementation(() => ({
    data: { ...defaultSettings, ...settings },
    isLoading: false,
  }))
}
