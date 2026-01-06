import { SettingsResponse } from 'api/gen'

export const selectIdCheckAddressAutocompletion = (settings: SettingsResponse) =>
  settings.idCheckAddressAutocompletion
