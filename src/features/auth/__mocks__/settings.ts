import { UseQueryResult } from 'react-query'

import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'

export const mockDefaultSettings: SettingsResponse = {
  isRecaptchaEnabled: true,
  enablePhoneValidation: true,
  displayDmsRedirection: true,
  appEnableAutocomplete: true,
  appEnableCategoryFilterPage: false,
  autoActivateDigitalBookings: true,
  enableFrontImageResizing: true,
  enableNewIdentificationFlow: false,
  enableUserProfiling: false,
  proDisableEventsQrcode: false,
  enableNativeCulturalSurvey: false,
  enableNativeIdCheckVerboseDebugging: false,
  idCheckAddressAutocompletion: true,
  objectStorageUrl: 'https://localhost-storage',
  isWebappV2Enabled: false,
  enableNativeEacIndividual: false,
  enableUnderageGeneralisation: false,
  accountCreationMinimumAge: 15,
  accountUnsuspensionLimit: 60,
  appEnableCookiesV2: false,
}

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () =>
    ({ data: mockDefaultSettings, isLoading: false, isSuccess: true } as UseQueryResult<
      SettingsResponse,
      unknown
    >)
)
