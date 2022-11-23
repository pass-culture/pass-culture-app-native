import { UseQueryResult } from 'react-query'

import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'

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

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () =>
    ({ data: mockDefaultSettings, isLoading: false, isSuccess: true } as UseQueryResult<
      SettingsResponse,
      unknown
    >)
)
