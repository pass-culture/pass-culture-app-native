import { NavigationState } from '@react-navigation/native'
import React, { createContext, useContext, memo } from 'react'

const NavigationStateChangeContext = createContext<NavigationState | undefined>(undefined)

export function useNavigationStateChange() {
  return useContext<NavigationState | undefined>(NavigationStateChangeContext)
}

export const NavigationStateChangeProvider = memo(function NavigationStateChangeProvider({
  children,
  state,
}: {
  state: NavigationState | undefined
  children: JSX.Element | JSX.Element[]
}) {
  return (
    <NavigationStateChangeContext.Provider value={state}>
      {children}
    </NavigationStateChangeContext.Provider>
  )
})
