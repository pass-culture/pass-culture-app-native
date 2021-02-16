import { BatchUser } from '@bam.tech/react-native-batch'
import React, { useContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import { SigninResponse } from 'api/gen'
import { firebaseAnalytics } from 'libs/analytics'
import { decodeAccessToken } from 'libs/jwt'
import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { storage } from 'libs/storage'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

const connectUserToBatchWithAccessTokenId = (accessToken: string) => {
  const tokenContent = decodeAccessToken(accessToken)
  if (tokenContent) {
    BatchUser.editor().setIdentifier(tokenContent.user_claims.user_id.toString()).save()
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    storage.readString('access_token').then((accessToken) => {
      setIsLoggedIn(!!accessToken)

      if (accessToken) {
        connectUserToBatchWithAccessTokenId(accessToken)
      }
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
    connectUserToBatchWithAccessTokenId(response.accessToken)
    await saveRefreshToken(response.refreshToken)
    await storage.saveString('access_token', response.accessToken)
    firebaseAnalytics.logLogin({ method })
    setIsLoggedIn(true)
  }

  return loginRoutine
}

export function useLogoutRoutine(): () => Promise<void> {
  const { setIsLoggedIn } = useAuthContext()
  const { clean: cleanProfile } = useCustomQueryClientHelpers('userProfile')

  return async () => {
    await storage.clear('access_token')
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
