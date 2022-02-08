import NetInfo from '@react-native-community/netinfo'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

import { api } from 'api/api'
import { refreshAccessToken } from 'api/apiHelpers'
import { SigninResponse } from 'api/gen'
import { useResetContexts } from 'features/auth/useResetContexts'
import { analytics, LoginRoutineMethod } from 'libs/analytics'
import { useAppStateChange } from 'libs/appState'
import { getAccessTokenStatus, getUserIdFromAccesstoken } from 'libs/jwt'
import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { BatchUser } from 'libs/react-native-batch'
import { storage } from 'libs/storage'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

const connectUserToBatchAndFirebase = (accessToken: string | null) => {
  if (!accessToken) return
  const userId = getUserIdFromAccesstoken(accessToken)
  if (userId) {
    BatchUser.editor().setIdentifier(userId.toString()).save()
    analytics.setUserId(userId)
    eventMonitoring.setUser({ id: userId.toString() })
  }
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

  const readTokenAndConnectUser = useCallback(async () => {
    try {
      let accessToken = await storage.readString('access_token')
      const { isConnected } = await NetInfo.fetch()

      if (!!accessToken && !isConnected) {
        setIsLoggedIn(true)
        return
      }

      if (getAccessTokenStatus(accessToken) === 'expired') {
        // refreshAccessToken calls the backend to get a new access token
        // and also saves it to the storage
        accessToken = await refreshAccessToken(api)
      }

      if (getAccessTokenStatus(accessToken) === 'valid') {
        setIsLoggedIn(true)
        connectUserToBatchAndFirebase(accessToken)
      }
    } catch (err) {
      eventMonitoring.captureException(err)
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }, [])

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

export function useLoginRoutine() {
  const { setIsLoggedIn } = useAuthContext()
  const resetContexts = useResetContexts()

  /**
   * Executes the minimal set of instructions required to proceed to the login
   * @param {SigninResponse} response
   * @param {LoginRoutineMethod} method The process that triggered the login routine
   */
  const loginRoutine = async (response: SigninResponse, method: LoginRoutineMethod) => {
    connectUserToBatchAndFirebase(response.accessToken)
    await saveRefreshToken(response.refreshToken)
    await storage.saveString('access_token', response.accessToken)
    analytics.logLogin({ method })
    setIsLoggedIn(true)
    resetContexts()
  }

  return loginRoutine
}

export function useLogoutRoutine(): () => Promise<void> {
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuthContext()

  return useCallback(async () => {
    try {
      BatchUser.editor().setIdentifier(null).save()
      analytics.logLogout()
      LoggedInQueryKeys.forEach((queryKey) => {
        queryClient.removeQueries(queryKey)
      })
      await storage.clear('access_token')
      await clearRefreshToken()
    } catch (err) {
      eventMonitoring.captureException(err)
    } finally {
      setIsLoggedIn(false)
    }
  }, [setIsLoggedIn])
}

// List of keys that are accessible only when logged in
// To clean when logging out
const LoggedInQueryKeys: QueryKeys[] = [
  QueryKeys.BOOKINGS,
  QueryKeys.FAVORITES,
  QueryKeys.FAVORITES_COUNT,
  QueryKeys.RECOMMENDATION_HITS,
  QueryKeys.RECOMMENDATION_OFFER_IDS,
  QueryKeys.REPORTED_OFFERS,
  QueryKeys.REPORT_OFFER_REASONS,
  QueryKeys.USER_PROFILE,
]
