import { SigninResponseV2 } from 'api/gen'
import { scheduleAccessTokenRemoval } from 'api/refreshAccessToken'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useResetContexts } from 'features/auth/context/useResetContexts'
import { useConnectServicesRequiringUserId } from 'features/auth/helpers/useConnectServicesRequiringUserId'
import { LoginRoutineMethod, LoginType } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
import { saveRefreshToken } from 'libs/keychain/keychain'
import { storage } from 'libs/storage'
import { logoutStoreActions } from 'shared/store/logoutStore'

export type LoginRoutine = (
  response: SigninResponseV2,
  method: LoginRoutineMethod,
  analyticsType?: LoginType
) => Promise<void>

export function useLoginRoutine(): LoginRoutine {
  const { setIsLoggedIn } = useAuthContext()
  const resetContexts = useResetContexts()
  const connectServicesRequiringUserId = useConnectServicesRequiringUserId()

  /**
   * Executes the minimal set of instructions required to proceed to the login
   * @param {SigninResponseV2} response
   * @param {LoginRoutineMethod} method The process that triggered the login routine
   */

  return async (response, method, analyticsType) => {
    // A new session starts: lift the logout guard so the API layer can redirect to
    // the login page again if the session breaks (e.g. expired refresh token).
    logoutStoreActions.setIsLoggingOut(false)
    connectServicesRequiringUserId(response.accessToken)
    await saveRefreshToken(response.refreshToken)
    await storage.saveString('access_token', response.accessToken)
    scheduleAccessTokenRemoval(response.accessToken)
    analytics.logLogin({ method, type: analyticsType })
    setIsLoggedIn(true)
    resetContexts()
  }
}
