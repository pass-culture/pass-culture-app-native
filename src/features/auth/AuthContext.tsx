import React, { useContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import { api } from 'api/api'
import { AccountRequest, SigninRequest } from 'api/gen'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { clearAccessToken, getAccessToken, saveAccessToken } from 'libs/storage'

export interface IAuthContext {
  isLoggedIn: boolean
  signIn: (data: SigninRequest) => Promise<boolean>
  signUp: (data: AccountRequest) => Promise<boolean>
  signOut: () => Promise<void>
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined)

export function useAuthContext(): IAuthContext {
  const authContext = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return authContext!
}

export const AuthWrapper = ({ children }: { children: Element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      setIsLoggedIn(!!accessToken)
    })
  }, [])

  const signIn = async (body: SigninRequest) => {
    try {
      const response = await api.nativeV1SigninPost(body, { credentials: 'omit' })
      if (!response) return false
      await saveRefreshToken(response.refresh_token)
      await saveAccessToken(response.access_token)
      await analytics.logLogin({ method: env.API_BASE_URL })
      setIsLoggedIn(true)
      return true
    } catch (error) {
      return false
    }
  }

  const signUp = async (body: AccountRequest) => {
    try {
      const response = await api.nativeV1AccountPost(body, { credentials: 'omit' })
      return !!response
    } catch (error) {
      return false
    }
  }

  const signOut = async () => {
    await clearAccessToken()
    await clearRefreshToken()
    await queryClient.removeQueries('userProfile')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSignIn(): IAuthContext['signIn'] {
  const authContext = useAuthContext()
  return authContext.signIn
}

export function useSignOut(): IAuthContext['signOut'] {
  const authContext = useAuthContext()
  return authContext.signOut
}

export function useSignUp(): IAuthContext['signUp'] {
  const authContext = useAuthContext()
  return authContext.signUp
}
