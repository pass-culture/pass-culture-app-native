import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'
import { UseQueryResult } from 'react-query'

export const mockDefaultSettings: SettingsResponse = {
  depositAmount: 30000,
  isRecaptchaEnabled: true,
  allowIdCheckRegistration: true,
  enableNativeIdCheckVersion: false,
  wholeFranceOpening: true,
  enablePhoneValidation: true,
  displayDmsRedirection: true,
  autoActivateDigitalBookings: true,
  enableIdCheckRetention: false,
  enableNativeIdCheckVerboseDebugging: false,
  idCheckAddressAutocompletion: false,
  objectStorageUrl: 'http://localhost-storage',
  useAppSearch: true,
  isWebappV2Enabled: false,
  enableNativeEacIndividual: false,
}

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () =>
    ({ data: mockDefaultSettings, isLoading: false } as UseQueryResult<SettingsResponse, unknown>)
)
