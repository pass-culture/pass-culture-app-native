import { api } from 'api/api'
import { SigninRequest } from 'api/gen'
import { loginRoutine, useAuthContext } from 'features/auth/AuthContext'

export function useSignIn(): (data: SigninRequest) => Promise<boolean> {
  const { setIsLoggedIn } = useAuthContext()

  return async (body: SigninRequest) => {
    try {
      const response = await api.postnativev1signin(body, { credentials: 'omit' })
      if (!response) return false

      await loginRoutine(response, 'fromLogin')
      setIsLoggedIn(true)
      return true
    } catch (error) {
      return false
    }
  }
}
