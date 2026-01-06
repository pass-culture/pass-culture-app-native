import { SettingsResponse } from 'api/gen'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { mockServer } from 'tests/mswServer'

export const setSettings = (settings: Partial<SettingsResponse> = {}) => {
  mockServer.getApi<SettingsResponse>('/v1/settings', { ...defaultSettings, ...settings })
}
