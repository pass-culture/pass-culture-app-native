import { SettingsResponse } from 'api/gen'

export const selectEnablePhoneValidation = (settings: SettingsResponse) =>
  settings.enablePhoneValidation
