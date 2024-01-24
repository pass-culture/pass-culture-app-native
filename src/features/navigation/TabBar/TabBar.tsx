import { BottomTabBarProps, BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React from 'react'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabBarContainer } from 'features/navigation/TabBar/TabBarContainer'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabStateRoute } from 'features/navigation/TabBar/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'

import { mapTabRouteToBicolorIcon } from './mapTabRouteToBicolorIcon'
import { TabBarComponent } from './TabBarComponent'

type Props = Pick<BottomTabBarProps, 'navigation'>

const scrollTopOfHomeIfOnHome = (
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>,
  route: TabStateRoute
) => {
  if (route.name === 'Home' && route.isSelected) {
    navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })
  }
}

export const TabBar: React.FC<Props> = ({ navigation }) => {
  const { tabRoutes } = useTabNavigationContext()
  const { searchState, dispatch, hideSuggestions } = useSearch()
  const { locationFilter } = searchState

  return (
    <TabBarContainer>
      {tabRoutes.map((route) => {
        const onPress = () => {
          if (route.name === 'Search') {
            if (route.isSelected) {
              dispatch({
                type: 'SET_STATE',
                payload: { ...initialSearchState, locationFilter },
              })
              hideSuggestions()
            } else {
              navigation.navigate('TabNavigator', { screen: route.name, params: searchState })
            }
          } else {
            const params = route.name === 'Home' ? undefined : route.params
            scrollTopOfHomeIfOnHome(navigation, route)
            navigation.navigate('TabNavigator', { screen: route.name, params })
          }
        }
        const tabNavConfig = getTabNavConfig(route.name)
        return (
          <TabBarComponent
            navigateTo={{ screen: tabNavConfig[0], params: tabNavConfig[1] }}
            enableNavigate={false}
            key={`key-tab-nav-${route.key}`}
            tabName={route.name}
            isSelected={route.isSelected}
            BicolorIcon={mapTabRouteToBicolorIcon(route.name)}
            onPress={onPress}
          />
        )
      })}
    </TabBarContainer>
  )
}
