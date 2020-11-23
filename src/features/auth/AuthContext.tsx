import React, { useContext, useEffect, useState } from 'react'

import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { post } from 'libs/fetch'
import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { saveAccessToken, clearAccessToken } from 'libs/storage'

import { useCurrentUser } from './api'

export type SigninBody = {
  email: string
  password: string
}

export type SigninResponse = {
  access_token: string
  refresh_token: string
}

export interface IAuthContext {
  isLoggedIn: boolean
  signIn: (data: SigninBody) => Promise<boolean>
  signOut: (email: string) => Promise<void>
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined)

export function useAuthContext(): IAuthContext {
  const authContext = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return authContext!
}

export const AuthWrapper = ({ children }: { children: Element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const { data: email, isError } = useCurrentUser()

  useEffect(() => {
    if (email) {
      setIsLoggedIn(true)
    }
    if (isError) {
      setIsLoggedIn(false)
    }
  }, [email, isError])

  const signIn = async ({ email, password }: SigninBody) => {
    const body = { identifier: email, password }
    try {
      const response = await post<SigninResponse>('/native/v1/signin', {
        body,
        credentials: 'omit',
      })
      if (!response) return false
      await saveRefreshToken(email, response.refresh_token)
      await saveAccessToken(response.access_token)
      await analytics.logLogin({ method: env.API_BASE_URL })
      setIsLoggedIn(true)
      return true
    } catch (error) {
      return false
    }
  }

  const signOut = async (email: string) => {
    await clearAccessToken()
    await clearRefreshToken(email)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut }}>{children}</AuthContext.Provider>
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
