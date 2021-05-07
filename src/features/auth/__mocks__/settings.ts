import { SettingsResponse } from 'api/gen'
import { useAppSettings as actualUseAppSettings } from 'features/auth/settings'
import { UseQueryResult } from 'react-query'

export const useAppSettings: typeof actualUseAppSettings = jest.fn(
  () =>
    ({
      data: { depositAmount: 30000, isRecaptchaEnabled: true, allowIdCheckRegistration: true },
      isLoading: false,
    } as UseQueryResult<SettingsResponse, unknown>)
)
