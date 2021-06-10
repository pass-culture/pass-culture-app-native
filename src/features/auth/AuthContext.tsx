import { BatchUser } from '@bam.tech/react-native-batch'
import { LocalStorageService } from '@pass-culture/id-check'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

import { SigninResponse } from 'api/gen'
import { analytics, firebaseAnalytics } from 'libs/analytics'
import { errorMonitoring } from 'libs/errorMonitoring'
import { getUserIdFromAccesstoken } from 'libs/jwt'
import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { QueryKeys } from 'libs/queryKeys'
import { storage } from 'libs/storage'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

const connectUserToBatchAndFirebase = (accessToken: string) => {
  const userId = getUserIdFromAccesstoken(accessToken)
  if (userId) {
    BatchUser.editor().setIdentifier(userId.toString()).save()
    analytics.setUserId(userId)
    errorMonitoring.setUser({ id: userId.toString() })
  }
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}

export const AuthWrapper = ({ children }: { children: Element }) => {
  const [isWaitingForLoggedInState, setIsWaitingForLoggedInState] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    storage.readString('access_token').then((accessToken) => {
      setIsLoggedIn(!!accessToken)

      if (accessToken) {
        connectUserToBatchAndFirebase(accessToken)
      }

      setIsWaitingForLoggedInState(false)
    })
  }, [])

  /**
   * warning: for a better data integrity, use setIsLoggedIn only from specific places
   * where it is needed:
   * - useLogoutRoutine: when logging out
   * - useLoginRoutine: when applying the logging in (signin or emailValidation)
   */
  if (isWaitingForLoggedInState) return null
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>
  )
}

export type LoginRoutineMethod = 'fromLogin' | 'fromSignup'

export function useLoginRoutine() {
  const { setIsLoggedIn } = useAuthContext()

  /**
   * Executes the minimal set of instructions required to proceed to the login
   * @param {SigninResponse} response
   * @param {LoginRoutineMethod} method The process that triggered the login routine
   */
  const loginRoutine = async (response: SigninResponse, method: LoginRoutineMethod) => {
    connectUserToBatchAndFirebase(response.accessToken)
    await saveRefreshToken(response.refreshToken)
    await storage.saveString('access_token', response.accessToken)
    firebaseAnalytics.logLogin({ method })
    setIsLoggedIn(true)
  }

  return loginRoutine
}

export function useIdCheckLogoutRoutine() {
  return useCallback(() => {
    LocalStorageService.resetCurrentUser()
    LocalStorageService.resetProfile()
    LocalStorageService.resetLicenceToken()
  }, [])
}

export function useLogoutRoutine(): () => Promise<void> {
  const { setIsLoggedIn } = useAuthContext()
  const { clean: cleanProfile } = useCustomQueryClientHelpers(QueryKeys.USER_PROFILE)
  const { clean: cleanFavorites } = useCustomQueryClientHelpers(QueryKeys.FAVORITES)

  return useCallback(async () => {
    try {
      BatchUser.editor().setIdentifier(null).save()
      analytics.logLogout()
      await storage.clear('access_token')
      await clearRefreshToken()
      await cleanProfile()
      await cleanFavorites()
    } catch (err) {
      errorMonitoring.captureException(err)
    } finally {
      setIsLoggedIn(false)
    }
  }, [setIsLoggedIn, cleanProfile, cleanFavorites])
}

/**
 * Returns helpers to play with inner react-query methods
 */
export function useCustomQueryClientHelpers(queryKey: QueryKeys) {
  const queryClient = useQueryClient()
  return useMemo(
    () => ({
      clean: async () => await queryClient.removeQueries(queryKey),
      // add your helper function that uses queryKey
    }),
    [queryClient]
  )
}
