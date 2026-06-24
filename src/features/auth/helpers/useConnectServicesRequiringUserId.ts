import { useCookies } from 'features/cookies/helpers/useCookies'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { getTokenExpirationDate } from 'libs/jwt/getTokenExpirationDate'
import { eventMonitoring } from 'libs/monitoring/services'
import { BatchProfile } from 'libs/react-native-batch'

export const useConnectServicesRequiringUserId = () => {
  const { setUserId: setUserIdToCookiesChoice } = useCookies()

  return (accessToken: string | null, userId: number | undefined) => {
    if (userId) {
      BatchProfile.identify(userId.toString())
      firebaseAnalytics.setUserId(userId)
      eventMonitoring.setUser({ id: userId.toString() })
      setUserIdToCookiesChoice(userId)
    }
    if (accessToken)
      eventMonitoring.setExtras({ accessTokenExpirationDate: getTokenExpirationDate(accessToken) })
  }
}
