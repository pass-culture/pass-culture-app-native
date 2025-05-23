import { QueryObserverResult } from '@tanstack/react-query'
import React, { useContext } from 'react'

import { UserProfileResponse } from 'api/gen'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  user?: UserProfileResponse
  refetchUser: () => Promise<QueryObserverResult<UserProfileResponse, unknown>>
  isUserLoading: boolean
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
  user: undefined,
  refetchUser: async () => ({}) as QueryObserverResult<UserProfileResponse>,
  isUserLoading: false,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}
