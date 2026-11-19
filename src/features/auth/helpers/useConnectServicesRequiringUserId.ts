import { useCookies } from 'features/cookies/helpers/useCookies'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { getTokenExpirationDate } from 'libs/jwt/getTokenExpirationDate'
import { eventMonitoring } from 'libs/monitoring/services'
import { BatchProfile } from 'libs/react-native-batch'

export const useConnectServicesRequiringUserId = () => {
  const { setUserId: setUserIdToCookiesChoice } = useCookies()

  return async (accessToken: string | null, userId: number | undefined) => {
    if (userId) {
      BatchProfile.identify(userId.toString())
      try {
        await firebaseAnalytics.setUserId(userId)
      } catch (error) {
        eventMonitoring.captureException(
          `'Failed to set user ID to firebase analytics': ${String(error)}`
        )
      }
      eventMonitoring.setUser({ id: userId.toString() })
      try {
        await setUserIdToCookiesChoice(userId)
      } catch (error) {
        eventMonitoring.captureException(
          `'Failed to set user ID to cookies choice': ${String(error)}`
        )
      }
    }
    if (accessToken)
      eventMonitoring.setExtras({ accessTokenExpirationDate: getTokenExpirationDate(accessToken) })
  }
}
