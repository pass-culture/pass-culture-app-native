import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'
import { UseQueryResult } from 'react-query'

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () =>
    ({
      data: { depositAmount: 30000, isRecaptchaEnabled: true, enableNativeIdCheckVersion: false },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>)
)
