import { SettingsResponse } from 'api/gen'

export const selectIneligiblePostalCodes = (settings: SettingsResponse) =>
  settings.ineligiblePostalCodes
