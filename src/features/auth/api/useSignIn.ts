import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { AccountState, SigninRequest } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { SignInResponseFailure } from 'features/auth/types'
import { useDeviceInfo } from 'features/profile/helpers/TrustedDevices/useDeviceInfo'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type SignInResponse = SignInResponseSuccess | SignInResponseFailure

type SignInResponseSuccess = {
  isSuccess: true
  accountState: AccountState
}

export function useSignIn(): (data: SigninRequest) => Promise<SignInResponse> {
  const loginRoutine = useLoginRoutine()
  const deviceInfo = useDeviceInfo()
  const enableTrustedDevice = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_TRUSTED_DEVICE)

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(
        { ...body, deviceInfo: enableTrustedDevice ? deviceInfo : undefined },
        { credentials: 'omit' }
      )
      await loginRoutine(response, 'fromLogin')
      const successResponse: SignInResponseSuccess = {
        isSuccess: true,
        accountState: response.accountState,
      }
      return successResponse
    } catch (error) {
      const errorResponse: SignInResponseFailure = { isSuccess: false }
      if (isApiError(error)) {
        errorResponse.statusCode = error.statusCode
        errorResponse.content = error.content
      } else {
        errorResponse.content = { code: 'NETWORK_REQUEST_FAILED', general: [] }
      }
      return errorResponse
    }
  }
}
