import { QueryObserverResult } from '@tanstack/react-query'
import React, { useContext } from 'react'

import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export interface IAuthContext {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  user?: UserProfileResponseWithoutSurvey
  refetchUser: () => Promise<QueryObserverResult<UserProfileResponseWithoutSurvey, unknown>>
  isUserLoading: boolean
}

export const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => undefined,
  user: undefined,
  refetchUser: async () => ({}) as QueryObserverResult<UserProfileResponseWithoutSurvey>,
  isUserLoading: false,
})

export function useAuthContext(): IAuthContext {
  return useContext(AuthContext)
}
