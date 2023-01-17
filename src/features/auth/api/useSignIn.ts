import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { AccountState, SigninRequest } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { SignInResponseFailure } from 'features/auth/types'

type SignInResponse = SignInResponseSuccess | SignInResponseFailure

type SignInResponseSuccess = {
  isSuccess: true
  accountState: AccountState
}

export function useSignIn(): (data: SigninRequest) => Promise<SignInResponse> {
  const loginRoutine = useLoginRoutine()

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(body, { credentials: 'omit' })
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
