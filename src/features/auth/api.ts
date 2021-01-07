import { api } from 'api/api'
import { AccountRequest, SigninRequest } from 'api/gen'
import { useLoginRoutine } from 'features/auth/AuthContext'

export function useSignIn(): (data: SigninRequest) => Promise<boolean> {
  const loginRoutine = useLoginRoutine()

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(body, { credentials: 'omit' })
      if (!response) return false

      await loginRoutine(response, 'fromLogin')
      return true
    } catch (error) {
      return false
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
