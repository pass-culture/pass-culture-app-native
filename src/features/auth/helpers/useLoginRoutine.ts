import { SigninResponseV2 } from 'api/gen'
import { scheduleAccessTokenRemoval } from 'api/refreshAccessToken'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useResetContexts } from 'features/auth/context/useResetContexts'
import { useConnectServicesRequiringUserId } from 'features/auth/helpers/useConnectServicesRequiringUserId'
import { LoginRoutineMethod, LoginType } from 'libs/analytics/logEventAnalytics'
import { analytics } from 'libs/analytics/provider'
import { saveRefreshToken } from 'libs/keychain/keychain'
import { storage } from 'libs/storage'

export type LoginRoutine = (
  response: SigninResponseV2,
  method: LoginRoutineMethod,
  analyticsType?: LoginType
) => Promise<void>

export function useLoginRoutine(): LoginRoutine {
  const { setIsLoggedIn, user } = useAuthContext()
  const resetContexts = useResetContexts()
  const connectServicesRequiringUserId = useConnectServicesRequiringUserId()

  return async (response, method, analyticsType) => {
    connectServicesRequiringUserId(response.accessToken, user?.id)
    await saveRefreshToken(response.refreshToken)
    await storage.saveString('access_token', response.accessToken)
    scheduleAccessTokenRemoval(response.accessToken)
    analytics.logLogin({ method, type: analyticsType })
    setIsLoggedIn(true)
    resetContexts()
  }
}
