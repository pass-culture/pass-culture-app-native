import { SettingsResponse } from 'api/gen'

export const selectAccountUnsuspensionLimit = (settings: SettingsResponse) =>
  settings.accountUnsuspensionLimit

export const selectIsRecaptchaEnabled = (settings: SettingsResponse) => settings.isRecaptchaEnabled

export const selectIdCheckAddressAutocompletion = (settings: SettingsResponse) =>
  settings.idCheckAddressAutocompletion

export const selectIneligiblePostalCodes = (settings: SettingsResponse) =>
  settings.ineligiblePostalCodes

export const selectAppEnableAutocomplete = (settings: SettingsResponse) =>
  settings.appEnableAutocomplete

export const selectPacificFrancToEuro = (settings: SettingsResponse) =>
  settings.rates?.pacificFrancToEuro

export const selectDepositAmountsByAge = (settings: SettingsResponse) =>
  settings.depositAmountsByAge

export const selectObjectStorageUrl = (settings: SettingsResponse) => settings.objectStorageUrl

export const selectEnableFrontImageResizing = (settings: SettingsResponse) =>
  settings.enableFrontImageResizing

export const selectBonificationBonusAmount = (settings: SettingsResponse) =>
  settings.bonification.bonusAmount

export const selectBonificationQfThreshold = (settings: SettingsResponse) =>
  settings.bonification.qfThreshold
