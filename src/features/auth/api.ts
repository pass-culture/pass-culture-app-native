import { useQuery } from 'react-query'

import { api } from 'api/api'
import { AccountRequest, GetIdCheckTokenResponse, SigninRequest } from 'api/gen'
import { useAuthContext, useLoginRoutine } from 'features/auth/AuthContext'

type SignInResponse =
  | {
      isSuccess: true
      content: undefined
    }
  | {
      isSuccess: false
      content?: {
        code: 'EMAIL_NOT_VALIDATED'
        general: string[]
      }
    }

export function useSignIn(): (data: SigninRequest) => Promise<SignInResponse> {
  const loginRoutine = useLoginRoutine()

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(body, { credentials: 'omit' })
      if (!response) return { isSuccess: false }

      await loginRoutine(response, 'fromLogin')
      return { isSuccess: true }
    } catch (error) {
      return { isSuccess: false, content: error.content }
    }
  }
}

export function useSignUp(): (data: AccountRequest) => Promise<boolean> {
  return async (body: AccountRequest) => {
    try {
      const response = await api.postnativev1account(body, { credentials: 'omit' })
      return !!response
    } catch (error) {
      return false
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
