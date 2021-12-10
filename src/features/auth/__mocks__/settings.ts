import { UseQueryResult } from 'react-query'

import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'

export const mockDefaultSettings: SettingsResponse = {
  accountCreationMinimumAge: 15,
  allowIdCheckRegistration: true,
  autoActivateDigitalBookings: true,
  depositAmount: 30000,
  displayDmsRedirection: true,
  enableCulturalSurvey: true,
  enableIdCheckRetention: false,
  enableNativeEacIndividual: false,
  enableNativeIdCheckVerboseDebugging: false,
  enablePhoneValidation: true,
  enableUnderageGeneralisation: false,
  idCheckAddressAutocompletion: true,
  isRecaptchaEnabled: true,
  isWebappV2Enabled: false,
  objectStorageUrl: 'http://localhost-storage',
}

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () =>
    ({ data: mockDefaultSettings, isLoading: false } as UseQueryResult<SettingsResponse, unknown>)
)
