import React, { useContext, useState } from 'react'

import { clearRefreshToken, saveRefreshToken } from 'libs/keychain'
import { saveAccessToken, clearAccessToken } from 'libs/storage'

import { signin } from './api'

interface SignInBody {
  email: string
  password: string
}

export interface IAuthContext {
  loggedIn: boolean
  signIn: (data: SignInBody) => Promise<boolean>
  signOut: (email: string) => Promise<void>
}

export const AuthContext = React.createContext<IAuthContext | undefined>(undefined)

export function useAuthContext(): IAuthContext {
  const authContext = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return authContext!
}

export const AuthWrapper = ({ children }: { children: Element }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const signIn = async ({ email, password }: SignInBody) => {
    const response = await signin({ email, password })
    if (response) {
      await saveRefreshToken(email, response.refresh_token)
      await saveAccessToken(response.access_token)
      setLoggedIn(true)
      return true
    }
    return false
  }

  const signOut = async (email: string) => {
    await clearAccessToken()
    await clearRefreshToken(email)
    setLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ loggedIn, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}
