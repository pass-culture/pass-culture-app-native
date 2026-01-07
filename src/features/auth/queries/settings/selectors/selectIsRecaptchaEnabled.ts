import { SettingsResponse } from 'api/gen'

export const selectIsRecaptchaEnabled = (settings: SettingsResponse) => settings.isRecaptchaEnabled
