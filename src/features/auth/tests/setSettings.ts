import { SettingsResponse } from 'api/gen'
import * as SettingsContextAPI from 'features/auth/context/SettingsContext'
import { defaultSettings } from 'features/auth/fixtures/fixtures'

export const setSettings = (settings: Partial<SettingsResponse> = {}) => {
  const useSettingsContextSpy = jest.spyOn(SettingsContextAPI, 'useSettingsContext')
  useSettingsContextSpy.mockImplementation(() => ({
    data: { ...defaultSettings, ...settings },
    isLoading: false,
  }))
}
