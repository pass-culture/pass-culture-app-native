import { SigninResponse } from 'api/gen'
import { scheduleAccessTokenRemoval } from 'api/refreshAccessToken'
import {
  useAuthContext,
  useConnectServicesRequiringUserId,
} from 'features/auth/context/AuthContext'
import { useResetContexts } from 'features/auth/context/useResetContexts'
// eslint-disable-next-line no-restricted-imports
import { LoginRoutineMethod, firebaseAnalytics } from 'libs/firebase/analytics'
import { saveRefreshToken } from 'libs/keychain'
import { storage } from 'libs/storage'

export function useLoginRoutine() {
  const { setIsLoggedIn } = useAuthContext()
  const resetContexts = useResetContexts()
  const connectServicesRequiringUserId = useConnectServicesRequiringUserId()

  /**
   * Executes the minimal set of instructions required to proceed to the login
   * @param {SigninResponse} response
   * @param {LoginRoutineMethod} method The process that triggered the login routine
   */

  return async (response: SigninResponse, method: LoginRoutineMethod) => {
    connectServicesRequiringUserId(response.accessToken)
    await saveRefreshToken(response.refreshToken)
    await storage.saveString('access_token', response.accessToken)
    scheduleAccessTokenRemoval(response.accessToken)
    firebaseAnalytics.logLogin({ method })
    setIsLoggedIn(true)
    resetContexts()
  }
}
