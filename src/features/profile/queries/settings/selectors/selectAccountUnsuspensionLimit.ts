import { SettingsResponse } from 'api/gen'

export const selectAccountUnsuspensionLimit = (settings: SettingsResponse) =>
  settings.accountUnsuspensionLimit
