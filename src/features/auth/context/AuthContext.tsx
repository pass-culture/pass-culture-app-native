import pick from 'lodash/pick'
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { QueryObserverResult } from 'react-query'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { navigateFromRef } from 'features/navigation/navigationRef'
// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { useAppStateChange } from 'libs/appState'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import {
  computeTokenRemainingLifetimeInMs,
  getTokenStatus,
  getUserIdFromAccessToken,
} from 'libs/jwt'
import { getTokenExpirationDate } from 'libs/jwt/getTokenExpirationDate'
import { clearRefreshToken, getRefreshToken } from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { getAppVersion } from 'libs/packageJson'
import { QueryKeys } from 'libs/queryKeys'
import { BatchUser } from 'libs/react-native-batch'
import { usePersistQuery } from 'libs/react-query/usePersistQuery'
import { storage } from 'libs/storage'
import { getAge } from 'shared/user/getAge'

const MAX_AVERAGE_SESSION_DURATION_IN_MS = 60 * 60 * 1000
export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  user?: UserProfileResponse
  refetchUser: () => Promise<QueryObserverResult<UserProfileResponse, unknown>>
  isUserLoading: boolean
}

const NAVIGATION_DELAY_FOR_EXPIRED_REFRESH_TOKEN_IN_MS = 1000

const navigateToLoginWithHelpMessage = () =>
  navigateFromRef('Login', { displayForcedLoginHelpMessage: true })

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

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
  user: undefined,
  refetchUser: async () => ({} as QueryObserverResult<UserProfileResponse>),
  isUserLoading: false,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}

export const AuthWrapper = memo(function AuthWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const navigationTimeoutRef = useRef<NodeJS.Timeout>()
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const connectServicesRequiringUserId = useConnectServicesRequiringUserId()
  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useUserProfileInfo(isLoggedIn)

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

  useEffect(() => {
    if (!user?.id) return

    const partialUser = pick(user, [
      'depositType',
      'eligibility',
      'eligibilityEndDatetime',
      'id',
      'isBeneficiary',
      'needsToFillCulturalSurvey',
    ])
    amplitude.setUserProperties({
      ...partialUser,
      ...(user.birthDate ? { age: getAge(user.birthDate) } : {}),
      status: user.status?.statusType, // eligible, beneficiaire, suspendu, etc
      appVersion: getAppVersion(),
    })
    amplitude.setUserId(user.id.toString())
  }, [user])

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

const STALE_TIME_USER_PROFILE = 5 * 60 * 1000
function useUserProfileInfo(isLoggedIn: boolean, options = {}) {
  const netInfo = useNetInfoContext()
  return usePersistQuery<UserProfileResponse>([QueryKeys.USER_PROFILE], () => api.getNativeV1Me(), {
    enabled: !!netInfo.isConnected && isLoggedIn,
    staleTime: STALE_TIME_USER_PROFILE,
    ...options,
  })
}
