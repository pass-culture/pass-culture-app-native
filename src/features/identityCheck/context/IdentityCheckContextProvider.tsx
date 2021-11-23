import React, { useContext, useMemo, useReducer } from 'react'

import {
  initialIdentityCheckState,
  identityCheckReducer,
} from 'features/identityCheck/context/reducer'
import { Action, IdentityCheckState } from 'features/identityCheck/context/types'

export interface IIdentityCheckContext extends IdentityCheckState {
  dispatch: React.Dispatch<Action>
}

export const IdentityCheckContext = React.createContext<IIdentityCheckContext | null>(null)

export const IdentityCheckContextProvider = ({ children }: { children: JSX.Element }) => {
  const [identityCheckState, dispatch] = useReducer(identityCheckReducer, initialIdentityCheckState)

  const value = useMemo(() => ({ ...identityCheckState, dispatch }), [identityCheckState, dispatch])
  return <IdentityCheckContext.Provider value={value}>{children}</IdentityCheckContext.Provider>
}

export const useIdentityCheckContext = (): IIdentityCheckContext => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(IdentityCheckContext)!
}
