import React, { createContext, useContext, memo, useState, useMemo } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { isPrivateScreen } from 'features/navigation/RootNavigator/linking/getScreensConfig'

import { getShouldDisplayTab } from './helpers'
import { TabNavigationStateType, TabStateRoute } from './types'

export const DEFAULT_TAB_ROUTES: TabStateRoute[] = [
  { name: 'Home', key: 'home-initial', isSelected: true },
  { name: 'Search', key: 'search-initial' },
  { name: 'Bookings', key: 'bookings-initial' },
  { name: 'Favorites', key: 'favorites-initial' },
  { name: 'Profile', key: 'profile-initial' },
]
const DEFAULT_TAB_NAVIGATION_STATE: TabNavigationStateType = {
  history: [],
  index: 0,
  key: 'tab',
  routeNames: DEFAULT_TAB_ROUTES.map((route) => route.name),
  routes: DEFAULT_TAB_ROUTES,
  stale: false,
  type: 'tab',
}
const DEFAULT_TAB_NAVIGATION_CONTEXT = {
  tabRoutes: DEFAULT_TAB_ROUTES,
  setTabNavigationState: () => {
    // do nothing
  },
}

type TabNavigationContextType = {
  tabRoutes: TabStateRoute[]
  setTabNavigationState: React.Dispatch<React.SetStateAction<TabNavigationStateType>>
}

const TabNavigationContext = createContext<TabNavigationContextType>(DEFAULT_TAB_NAVIGATION_CONTEXT)

export function useTabNavigationContext() {
  return useContext(TabNavigationContext)
}

export const TabNavigationStateProvider: React.FC = memo(function _TabNavigationStateProvider(
  props
) {
  const { isLoggedIn, user } = useAuthContext()
  const isBeneficiary = user ? user.isBeneficiary : false
  const shouldDisplayTab = getShouldDisplayTab({ isLoggedIn, isBeneficiary })

  const [tabNavigationState, setTabNavigationState] = useState<TabNavigationStateType>(
    DEFAULT_TAB_NAVIGATION_STATE
  )

  const tabNavigationContext = useMemo(() => {
    const tabRoutes: TabStateRoute[] = []
    tabNavigationState.routes.forEach((route, index) => {
      if (isPrivateScreen(route.name) || !shouldDisplayTab(route.name)) return
      tabRoutes.push({ ...route, isSelected: tabNavigationState.index === index })
    })
    return { tabRoutes, setTabNavigationState }
  }, [shouldDisplayTab, tabNavigationState])

  return (
    <TabNavigationContext.Provider value={tabNavigationContext}>
      {props.children}
    </TabNavigationContext.Provider>
  )
})
