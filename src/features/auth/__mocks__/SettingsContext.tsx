import { SettingsResponse } from 'api/gen'

import { useSettingsContext as actualUseSettingsContext } from '../SettingsContext'

export const mockDefaultSettings: SettingsResponse = {
  accountCreationMinimumAge: 15,
  accountUnsuspensionLimit: 60,
  appEnableAutocomplete: true,
  appEnableCookiesV2: true,
  disableStoreReview: false,
  displayDmsRedirection: true,
  enableFrontImageResizing: true,
  enableNativeCulturalSurvey: false,
  enableNativeIdCheckVerboseDebugging: false,
  enableNewIdentificationFlow: false,
  enablePhoneValidation: true,
  idCheckAddressAutocompletion: true,
  isRecaptchaEnabled: true,
  objectStorageUrl: 'https://localhost-storage',
  proDisableEventsQrcode: false,
}
export const useSettingsContext = jest.fn().mockReturnValue({
  data: mockDefaultSettings,
  isLoading: false,
}) as jest.MockedFunction<typeof actualUseSettingsContext>
