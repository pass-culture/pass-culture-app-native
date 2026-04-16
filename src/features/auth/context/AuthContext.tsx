import { QueryObserverResult } from '@tanstack/react-query'
import React, { useContext } from 'react'

import { UserProfile } from 'features/share/types'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  user?: UserProfile
  refetchUser: () => Promise<QueryObserverResult<UserProfile, unknown>>
  isUserLoading: boolean
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
  user: undefined,
  refetchUser: async () => ({}) as QueryObserverResult<UserProfile>,
  isUserLoading: false,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}
