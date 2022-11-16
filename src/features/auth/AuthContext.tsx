import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { api } from 'api/api'
import { refreshAccessToken } from 'api/apiHelpers'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { useAppStateChange } from 'libs/appState'
import { analytics } from 'libs/firebase/analytics'
import { getAccessTokenStatus, getUserIdFromAccesstoken } from 'libs/jwt'
import { eventMonitoring } from 'libs/monitoring'
import { BatchUser } from 'libs/react-native-batch'
import { storage } from 'libs/storage'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const useConnectServicesRequiringUserId = (): ((accessToken: string | null) => void) => {
  const { setUserId: setUserIdToCookiesChoice } = useCookies()
  return useCallback(
    (accessToken) => {
      if (!accessToken) return

      const userId = getUserIdFromAccesstoken(accessToken)
      if (userId) {
        BatchUser.editor().setIdentifier(userId.toString()).save()
        analytics.setUserId(userId)
        eventMonitoring.setUser({ id: userId.toString() })
        setUserIdToCookiesChoice(userId)
      }
    },
    [setUserIdToCookiesChoice]
  )
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}

export const AuthWrapper = memo(function AuthWrapper({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const connectServicesRequiringUserId = useConnectServicesRequiringUserId()

  const readTokenAndConnectUser = useCallback(async () => {
    try {
      let accessToken = await storage.readString('access_token')

      if (getAccessTokenStatus(accessToken) === 'expired') {
        // refreshAccessToken calls the backend to get a new access token
        // and also saves it to the storage
        const { result, error } = await refreshAccessToken(api)

        if (error) {
          eventMonitoring.captureException(new Error(`AuthWrapper ${error}`))
          setIsLoggedIn(false)
          return
        }

        if (result) {
          accessToken = result
        }
      }

      if (getAccessTokenStatus(accessToken) === 'valid') {
        setIsLoggedIn(true)
        connectServicesRequiringUserId(accessToken)
      }
    } catch (err) {
      eventMonitoring.captureException(err)
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }, [connectServicesRequiringUserId])

  useEffect(() => {
    readTokenAndConnectUser()
  }, [readTokenAndConnectUser])

  useAppStateChange(readTokenAndConnectUser, () => void 0, [isLoggedIn])

  const value = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn, setIsLoggedIn])

  if (loading) return null
  /**
   * warning: for a better data integrity, use setIsLoggedIn only from specific places
   * where it is needed:
   * - useLogoutRoutine: when logging out
   * - useLoginRoutine: when applying the logging in (signin or emailValidation)
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
})
