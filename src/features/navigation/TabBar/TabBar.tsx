import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabBarContainer } from 'features/navigation/TabBar/TabBarContainer'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'

import { mapTabRouteToBicolorIcon } from './mapTabRouteToBicolorIcon'
import { TabBarComponent } from './TabBarComponent'

type Props = Pick<BottomTabBarProps, 'navigation'>

export const TabBar: React.FC<Props> = ({ navigation }) => {
  const { tabRoutes } = useTabNavigationContext()
  const { searchState } = useSearch()
  const { locationFilter } = searchState

  return (
    <TabBarContainer>
      {tabRoutes.map((route) => {
        const onPress = () => {
          if (route.name === 'Search') {
            if (route.isSelected) {
              navigation.setParams({
                ...initialSearchState,
                locationFilter,
              })
            } else {
              navigation.navigate('TabNavigator', { screen: route.name, params: searchState })
            }
          } else {
            const params = route.name === 'Home' ? undefined : route.params
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
