import { useQuery } from 'react-query'

import { api } from 'api/api'
import { AccountRequest, GetIdCheckTokenResponse, SigninRequest } from 'api/gen'
import { isApiError } from 'api/helpers'
import { useAuthContext, useLoginRoutine } from 'features/auth/AuthContext'

export type SignInResponse = SignInResponseSuccess | SignInResponseFailure

export type SignInResponseSuccess = {
  isSuccess: true
}

export type SignInResponseFailure = {
  isSuccess: false
  content?: {
    code: 'EMAIL_NOT_VALIDATED' | 'NETWORK_REQUEST_FAILED'
    general: string[]
  }
}

type SignUpResponse =
  | {
      isSuccess: true
      content: undefined
    }
  | {
      isSuccess: false
      content?: {
        code: 'NETWORK_REQUEST_FAILED'
        general: string[]
      }
    }

export function useSignIn(): (data: SigninRequest) => Promise<SignInResponse> {
  const loginRoutine = useLoginRoutine()

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(body, { credentials: 'omit' })
      await loginRoutine(response, 'fromLogin')
      const successResponse: SignInResponseSuccess = { isSuccess: true }
      return successResponse
    } catch (error) {
      const errorResponse: SignInResponseFailure = { isSuccess: false }
      if (isApiError(error)) {
        errorResponse.content = error.content
      } else {
        errorResponse.content = { code: 'NETWORK_REQUEST_FAILED', general: [] }
      }
      return errorResponse
    }
  }
}

export function useSignUp(): (data: AccountRequest) => Promise<SignUpResponse> {
  return async (body: AccountRequest) => {
    try {
      const response = await api.postnativev1account(body, { credentials: 'omit' })
      return { isSuccess: !!response }
    } catch (error) {
      return {
        isSuccess: false,
        content: { code: 'NETWORK_REQUEST_FAILED', general: [] },
      }
    }
  }
}

export function useGetIdCheckToken(queryCondition?: boolean) {
  queryCondition = queryCondition ?? true

  const { isLoggedIn } = useAuthContext()

  return useQuery<GetIdCheckTokenResponse>('idCheckToken', () => api.getnativev1idCheckToken(), {
    enabled: queryCondition && isLoggedIn,
  })
}
