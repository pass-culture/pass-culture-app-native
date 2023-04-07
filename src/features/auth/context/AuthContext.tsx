import pick from 'lodash/pick'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { QueryObserverResult } from 'react-query'

import { api } from 'api/api'
import { refreshAccessToken } from 'api/apiHelpers'
import { UserProfileResponse } from 'api/gen'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { amplitude } from 'libs/amplitude'
import { useAppStateChange } from 'libs/appState'
import { analytics } from 'libs/firebase/analytics'
import { getAccessTokenStatus, getUserIdFromAccesstoken } from 'libs/jwt'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { BatchUser } from 'libs/react-native-batch'
import { usePersistQuery } from 'libs/react-query/usePersistQuery'
import { storage } from 'libs/storage'
import { getAge } from 'shared/user/getAge'

import { version as appVersion } from '../../../../package.json'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  user?: UserProfileResponse
  refetchUser: () => Promise<QueryObserverResult<UserProfileResponse, unknown>>
  isUserLoading: boolean
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
  user: undefined,
  refetchUser: async () => ({} as QueryObserverResult<UserProfileResponse>),
  isUserLoading: false,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}

export const AuthWrapper = memo(function AuthWrapper({ children }: { children: JSX.Element }) {
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
      let accessToken = await storage.readString('access_token')
      const accessTokenStatus = getAccessTokenStatus(accessToken)

      if (accessTokenStatus === 'expired') {
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
      if (accessTokenStatus === 'valid') {
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

  useEffect(() => {
    if (!user) return

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
      appVersion,
    })
  }, [user])

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

const STALE_TIME_USER_PROFILE = 5 * 60 * 1000
function useUserProfileInfo(isLoggedIn: boolean, options = {}) {
  const netInfo = useNetInfoContext()
  return usePersistQuery<UserProfileResponse>([QueryKeys.USER_PROFILE], () => api.getnativev1me(), {
    enabled: !!netInfo.isConnected && isLoggedIn,
    staleTime: STALE_TIME_USER_PROFILE,
    ...options,
  })
}
