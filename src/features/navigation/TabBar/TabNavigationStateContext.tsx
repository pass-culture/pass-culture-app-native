import React, { createContext, useContext, memo, useState, useMemo, PropsWithChildren } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'

import { TabNavigationStateType, TabStateRoute } from '../navigators/TabNavigator/types'

import { getShouldDisplayTab } from './helpers'

export const DEFAULT_TAB_ROUTES: TabStateRoute[] = [
  { name: 'Home', key: 'home-initial', isSelected: true },
  { name: 'SearchStackNavigator', key: 'search-initial' },
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
  preloadedRouteKeys: [],
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

const PRIVATE_SCREEN_PREFIX = '_DeeplinkOnly'
function isPrivateScreen(name: string): boolean {
  return name.startsWith(PRIVATE_SCREEN_PREFIX)
}

export const TabNavigationStateProvider: React.FC<PropsWithChildren> = memo(
  function TabNavigationStateProviderImplementation(props) {
    const { isLoggedIn, user } = useAuthContext()

    const shouldDisplayTab = getShouldDisplayTab({
      isLoggedIn,
      isBeneficiary: !!user?.isBeneficiary,
    })

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
  }
)
