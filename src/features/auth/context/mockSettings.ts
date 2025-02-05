import { SettingsResponse } from 'api/gen'
import * as useSettingsModule from 'features/auth/context/useSettings'
import { defaultSettings } from 'features/auth/fixtures/fixtures'

export const mockSettings = (settings: Partial<SettingsResponse> = {}) => {
  const useSettingsContextSpy = jest.spyOn(useSettingsModule, 'useSettings')
  useSettingsContextSpy.mockImplementation(() => ({
    data: { ...defaultSettings, ...settings },
    isLoading: false,
  }))
}
