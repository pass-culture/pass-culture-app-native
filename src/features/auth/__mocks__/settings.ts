import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'
import { UseQueryResult } from 'react-query'

const data: SettingsResponse = {
  depositAmount: 30000,
  isRecaptchaEnabled: true,
  allowIdCheckRegistration: true,
  enableNativeIdCheckVersion: false,
  wholeFranceOpening: false,
  enablePhoneValidation: true,
  displayDmsRedirection: true,
  autoActivateDigitalBookings: true,
  enableIdCheckRetention: false,
  enableNativeIdCheckVerboseDebugging: false,
  idCheckAddressAutocompletion: false,
  objectStorageUrl: 'http://localhost-storage',
  useAppSearch: false,
}

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () => ({ data, isLoading: false } as UseQueryResult<SettingsResponse, unknown>)
)
