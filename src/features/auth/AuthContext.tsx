import { BatchUser } from '@bam.tech/react-native-batch'
import { LocalStorageService } from '@pass-culture/id-check'
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

import { api } from 'api/api'
import { refreshAccessToken } from 'api/apiHelpers'
import { SigninResponse } from 'api/gen'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { analytics, LoginRoutineMethod } from 'libs/analytics'
import { useAppStateChange } from 'libs/appState'
import { getAccessTokenStatus, getUserIdFromAccesstoken } from 'libs/jwt'
import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
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

      if (getAccessTokenStatus(accessToken) === 'expired') {
        // refreshAccessToken calls the backend to get a new acces token
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

export function signOutFromIdCheck() {
  LocalStorageService.resetCurrentUser()
  LocalStorageService.resetProfile()
  LocalStorageService.resetLicenceToken()
}

export function useLogoutRoutine(): () => Promise<void> {
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuthContext()
  const resetContexts = useResetContexts()

  return useCallback(async () => {
    try {
      BatchUser.editor().setIdentifier(null).save()
      analytics.logLogout()
      LoggedInQueryKeys.forEach((queryKey) => {
        queryClient.removeQueries(queryKey)
      })
      resetContexts()
      await storage.clear('access_token')
      await clearRefreshToken()
    } catch (err) {
      eventMonitoring.captureException(err)
    } finally {
      setIsLoggedIn(false)
    }
  }, [setIsLoggedIn])
}

// We also reset the different context that depend on the user
const useResetContexts = () => {
  const { dispatch: dispatchSearch } = useSearch()
  const { dispatch: dispatchIdentityCheck } = useIdentityCheckContext()

  return () => {
    // initialise search state to make sure search results correspond to user available categories
    dispatchSearch({ type: 'INIT' })
    dispatchIdentityCheck({ type: 'INIT' })
  }
}

// List of keys that are accessible only when logged in
// To clean when logging out
const LoggedInQueryKeys: QueryKeys[] = [
  QueryKeys.BOOKINGS,
  QueryKeys.FAVORITES,
  QueryKeys.FAVORITES_COUNT,
  QueryKeys.ID_CHECK_TOKEN,
  QueryKeys.RECOMMENDATION_HITS,
  QueryKeys.RECOMMENDATION_OFFER_IDS,
  QueryKeys.REPORTED_OFFERS,
  QueryKeys.REPORT_OFFER_REASONS,
  QueryKeys.USER_PROFILE,
]
