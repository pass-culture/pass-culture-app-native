import { SettingsResponse } from 'api/gen'

export const selectAppEnableAutocomplete = (settings: SettingsResponse) =>
  settings.appEnableAutocomplete
