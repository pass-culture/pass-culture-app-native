import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AuthContext } from 'features/auth/context/AuthContext'
import { useConnectServicesRequiringUserId } from 'features/auth/helpers/useConnectServicesRequiringUserId'
import { useUserProfileInfoQuery } from 'features/auth/queries/useUserProfileInfoQuery'
import { navigateFromRef } from 'features/navigation/navigationRef'
// eslint-disable-next-line no-restricted-imports
import { useAppStateChange } from 'libs/appState'
import { getTokenExpirationDate } from 'libs/jwt/getTokenExpirationDate'
import { computeTokenRemainingLifetimeInMs, getTokenStatus } from 'libs/jwt/jwt'
import { clearRefreshToken, getRefreshToken } from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { storage } from 'libs/storage'
const NAVIGATION_DELAY_FOR_EXPIRED_REFRESH_TOKEN_IN_MS = 1000

const MAX_AVERAGE_SESSION_DURATION_IN_MS = 60 * 60 * 1000

const navigateToLoginWithHelpMessage = () =>
  navigateFromRef('Login', { displayForcedLoginHelpMessage: true })

export const AuthWrapper = memo(function AuthWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const timeoutRef = useRef<number>(null)
  const navigationTimeoutRef = useRef<number>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const connectServicesRequiringUserId = useConnectServicesRequiringUserId()
  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useUserProfileInfoQuery(isLoggedIn)

  const readTokenAndConnectUser = useCallback(async () => {
    try {
      const refreshToken = await getRefreshToken()
      const accessToken = await storage.readString('access_token')
      const refreshTokenStatus = getTokenStatus(refreshToken)

      switch (refreshTokenStatus) {
        case 'unknown':
          setIsLoggedIn(false)
          return
        case 'expired':
          setIsLoggedIn(false)
          // We need to delay this navigation to avoid conflit between this navigation and the initial screen defined by react-navigation on app launch
          navigationTimeoutRef.current = setTimeout(async () => {
            navigateToLoginWithHelpMessage()
            await clearRefreshToken()
          }, NAVIGATION_DELAY_FOR_EXPIRED_REFRESH_TOKEN_IN_MS)
          return
        case 'valid':
          setIsLoggedIn(true)
          connectServicesRequiringUserId(accessToken)
          if (refreshToken) {
            eventMonitoring.setExtras({
              refreshTokenExpirationDate:
                getTokenExpirationDate(refreshToken) ?? "can't get refresh token expiration date",
            })
            const remainingLifetimeInMs = computeTokenRemainingLifetimeInMs(refreshToken)
            if (
              remainingLifetimeInMs &&
              remainingLifetimeInMs < MAX_AVERAGE_SESSION_DURATION_IN_MS
            ) {
              timeoutRef.current = globalThis.setTimeout(async () => {
                setIsLoggedIn(false)
                navigateToLoginWithHelpMessage()
                await clearRefreshToken()
              }, remainingLifetimeInMs)
            }
          }
          return
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

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current)
    }
  }, [readTokenAndConnectUser])

  useAppStateChange(readTokenAndConnectUser, () => void 0, [isLoggedIn])

  const value = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, user, refetchUser, isUserLoading }),
    [isLoggedIn, setIsLoggedIn, user, refetchUser, isUserLoading]
  )

  if (loading) return null
  /**
   * warning: for a better data integrity, use setIsLoggedIn only from specific places
   * where it is needed:
   * - useLogoutRoutine: when logging out
   * - useLoginRoutine: when applying the logging in (signin or emailValidation)
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
})
