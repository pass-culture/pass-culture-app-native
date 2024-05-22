import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'

import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabBarContainer } from 'features/navigation/TabBar/TabBarContainer'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { useTabBar } from 'features/navigation/TabBar/useTabBar'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { TabBarComponent } from './TabBarComponent'

type Props = Pick<BottomTabBarProps, 'navigation' | 'state'>

export const TabBar: React.FC<Props> = ({ navigation, state }) => {
  const { tabRoutes } = useTabNavigationContext()
  const { searchState, dispatch, hideSuggestions } = useSearch()
  const { setDisabilities, disabilities } = useAccessibilityFiltersContext()
  const enableTabBarV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_TAB_BAR)

  const { locationFilter } = searchState

  useTabBar({ state })

  return (
    <TabBarContainer v2={!!enableTabBarV2}>
      {tabRoutes.map((route) => {
        const onPress = () => {
          const navigateParams: { screen: string; params?: unknown } = {
            screen: route.name,
            params: route.params,
          }
          switch (route.name) {
            case 'Home':
              if (route.isSelected) {
                // make the screen scroll to top (mobile only - Home only)
                navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })
              }
              navigateParams.params = undefined
              break
            case 'SearchStackNavigator':
              if (route.isSelected) {
                dispatch({
                  type: 'SET_STATE',
                  payload: {
                    ...initialSearchState,
                    locationFilter,
                  },
                })
                setDisabilities(defaultDisabilitiesProperties)
                hideSuggestions()
                navigateParams.params = {
                  screen: 'SearchLanding',
                  params: {
                    ...initialSearchState,
                    accessibilityFilter: defaultDisabilitiesProperties,
                  },
                }
              } else {
                const nbOfRoutes = route.state?.routes?.length ? route.state.routes.length : 0
                navigateParams.params = {
                  screen: nbOfRoutes > 1 ? 'SearchResults' : 'SearchLanding',
                  params: { ...searchState, accessibilityFilter: disabilities },
                }
              }
              break
            case 'Bookings':
            case 'Favorites':
            case 'Profile':
              break
          }
          navigation.navigate('TabNavigator', navigateParams)
        }
        const tabNavConfig = getTabNavConfig(route.name)
        return (
          <TabBarComponent
            v2={!!enableTabBarV2}
            navigateTo={{ screen: tabNavConfig[0], params: tabNavConfig[1] }}
            enableNavigate={false}
            key={`key-tab-nav-${route.key}`}
            tabName={route.name}
            isSelected={route.isSelected}
            onPress={onPress}
          />
        )
      })}
    </TabBarContainer>
  )
}
