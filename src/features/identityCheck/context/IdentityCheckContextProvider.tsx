import React, { useContext, useReducer } from 'react'

import {
  initialIdentityCheckState,
  identityCheckReducer,
} from 'features/identityCheck/context/reducer'
import { Action, IdentityCheckState } from 'features/identityCheck/context/types'

export interface IIdentityCheckContext {
  identityCheckState: IdentityCheckState
  dispatch: React.Dispatch<Action>
}

export const IdentityCheckContext = React.createContext<IIdentityCheckContext | null>(null)

export const IdentityCheckContextProvider = ({ children }: { children: JSX.Element }) => {
  const [identityCheckState, dispatch] = useReducer(identityCheckReducer, initialIdentityCheckState)

  return (
    <IdentityCheckContext.Provider value={{ identityCheckState, dispatch }}>
      {children}
    </IdentityCheckContext.Provider>
  )
}

export const useIdentityCheckContext = (): IIdentityCheckContext => {
  const { identityCheckState, dispatch } = useContext(IdentityCheckContext)!
  return { identityCheckState, dispatch }
}
