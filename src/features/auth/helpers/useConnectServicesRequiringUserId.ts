import { useCallback } from 'react'

import { useCookies } from 'features/cookies/helpers/useCookies'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { getTokenExpirationDate } from 'libs/jwt/getTokenExpirationDate'
import { getUserIdFromAccessToken } from 'libs/jwt/jwt'
import { eventMonitoring } from 'libs/monitoring'
import { BatchUser } from 'libs/react-native-batch'

export const useConnectServicesRequiringUserId = (): ((accessToken: string | null) => void) => {
  const { setUserId: setUserIdToCookiesChoice } = useCookies()

  return useCallback(
    (accessToken) => {
      if (!accessToken) return

      const userId = getUserIdFromAccessToken(accessToken)
      if (userId) {
        BatchUser.editor().setIdentifier(userId.toString()).save()
        firebaseAnalytics.setUserId(userId)
        eventMonitoring.setUser({ id: userId.toString() })

        eventMonitoring.setExtras({
          accessTokenExpirationDate:
            getTokenExpirationDate(accessToken) ?? "can't get access token expiration date",
        })
        setUserIdToCookiesChoice(userId)
      }
    },
    [setUserIdToCookiesChoice]
  )
}
