import React, { useContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import { SigninResponse } from 'api/gen'
import { firebaseAnalytics } from 'libs/analytics'
import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { clearAccessToken, getAccessToken, saveAccessToken } from 'libs/storage'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}

export const AuthWrapper = ({ children }: { children: Element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      setIsLoggedIn(!!accessToken)
    })
  }, [])

  /**
   * warning: for a better data integrity, use setIsLoggedIn only from specific places
   * where it is needed:
   * - useLogoutRoutine: when logging out
   * - useLoginRoutine: when applying the logging in (signin or emailValidation)
   */
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
    setIsLoggedIn(true)
    await saveRefreshToken(response.refreshToken)
    await saveAccessToken(response.accessToken)
    firebaseAnalytics.logLogin({ method })
  }

  return loginRoutine
}

export function useLogoutRoutine(): () => Promise<void> {
  const { setIsLoggedIn } = useAuthContext()
  const { clean: cleanProfile } = useCustomQueryClientHelpers('userProfile')

  return async () => {
    await clearAccessToken()
    await clearRefreshToken()
    await cleanProfile()
    setIsLoggedIn(false)
  }
}

/**
 * Returns helpers to play with inner react-query methods
 */
export function useCustomQueryClientHelpers(queryKey: string) {
  const queryClient = useQueryClient()
  return {
    clean: async () => await queryClient.removeQueries(queryKey),
    // add your helper function that uses queryKey
  }
}
