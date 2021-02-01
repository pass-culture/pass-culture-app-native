import { api } from 'api/api'
import { AccountRequest, SigninRequest } from 'api/gen'
import { useLoginRoutine } from 'features/auth/AuthContext'

type SignInResponse =
  | {
      isSuccess: true
      content: undefined
    }
  | {
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
      if (!response) return { isSuccess: false }
      await loginRoutine(response, 'fromLogin')
      return { isSuccess: true }
    } catch (error) {
      return {
        isSuccess: false,
        content: error.statusCode ? error.content : { code: `NETWORK_REQUEST_FAILED`, general: [] },
      }
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
