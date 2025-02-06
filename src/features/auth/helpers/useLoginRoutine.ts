import { SigninResponse } from 'api/gen'
import { scheduleAccessTokenRemoval } from 'api/refreshAccessToken'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useResetContexts } from 'features/auth/context/useResetContexts'
import { useConnectServicesRequiringUserId } from 'features/auth/helpers/useConnectServicesRequiringUserId'
import { LoginRoutineMethod, SSOType } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
import { saveRefreshToken } from 'libs/keychain/keychain'
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

  return async (response: SigninResponse, method: LoginRoutineMethod, analyticsType?: SSOType) => {
    connectServicesRequiringUserId(response.accessToken)
    await saveRefreshToken(response.refreshToken)
    await storage.saveString('access_token', response.accessToken)
    scheduleAccessTokenRemoval(response.accessToken)
    analytics.logLogin({ method, type: analyticsType })
    setIsLoggedIn(true)
    resetContexts()
  }
}
