import { UseQueryResult } from 'react-query'

import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'

export const mockDefaultSettings: SettingsResponse = {
  depositAmount: 30000,
  isRecaptchaEnabled: true,
  allowIdCheckRegistration: true,
  wholeFranceOpening: true,
  enablePhoneValidation: true,
  displayDmsRedirection: true,
  autoActivateDigitalBookings: true,
  enableIdCheckRetention: false,
  enableNativeIdCheckVerboseDebugging: false,
  idCheckAddressAutocompletion: true,
  objectStorageUrl: 'http://localhost-storage',
  useAppSearch: false,
  isWebappV2Enabled: false,
  enableNativeEacIndividual: false,
  enableUnderageGeneralisation: false,
  accountCreationMinimumAge: 15,
}

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () =>
    ({ data: mockDefaultSettings, isLoading: false } as UseQueryResult<SettingsResponse, unknown>)
)
