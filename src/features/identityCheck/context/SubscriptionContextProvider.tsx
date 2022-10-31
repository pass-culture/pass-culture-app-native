import React, { useContext, useMemo, useReducer } from 'react'

import {
  initialSubscriptionState,
  SubscriptionReducer,
} from 'features/identityCheck/context/reducer'
import { Action, SubscriptionState } from 'features/identityCheck/context/types'

interface ISubscriptionContext extends SubscriptionState {
  dispatch: React.Dispatch<Action>
}

const SubscriptionContext = React.createContext<ISubscriptionContext | null>(null)

export const SubscriptionContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const [subscriptionState, dispatch] = useReducer(SubscriptionReducer, initialSubscriptionState)

  const value = useMemo(() => ({ ...subscriptionState, dispatch }), [subscriptionState, dispatch])
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export const useSubscriptionContext = (): ISubscriptionContext => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(SubscriptionContext)!
}
