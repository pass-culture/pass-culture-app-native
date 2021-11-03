import { BottomTabBarOptions, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { BicolorFavoriteCount } from 'features/favorites/atoms/BicolorFavoriteCount'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabNavigationStateType } from 'features/navigation/TabBar/types'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getShadow, getSpacing, Spacer } from 'ui/theme'

import { useCustomSafeInsets } from '../../../ui/theme/useCustomSafeInsets'

import { TabBarComponent } from './TabBarComponent'
import { TabRouteName } from './types'

function mapRouteToIcon(route: TabRouteName): React.FC<BicolorIconInterface> {
  switch (route) {
    case 'Home':
      return BicolorLogo
    case 'Search':
      return BicolorSearch
    case 'Bookings':
      return BicolorBookings
    case 'Favorites':
      return BicolorFavoriteCount
    case 'Profile':
      return BicolorProfile
  }
}

type TabBarProps = {
  state: TabNavigationStateType
  hidden?: boolean
} & Pick<BottomTabBarProps<BottomTabBarOptions>, 'navigation'>

export const TabBar: React.FC<TabBarProps> = ({ navigation, hidden, state }) => {
  const { tabRoutes, setTabNavigationState } = useTabNavigationContext()
  const { bottom } = useCustomSafeInsets()

  useEffect(() => {
    setTabNavigationState(state)
  }, [])

  if (hidden) {
    return null
  }
  return (
    <MainContainer>
      <RowContainer>
        <Spacer.Row numberOfSpaces={4} />
        {tabRoutes.map((route) => {
          const onPress = () => {
            if (route.isSelected) return
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }
          return (
            <TabBarComponent
              key={`key-tab-nav-${route.key}`}
              tabName={route.name}
              isSelected={route.isSelected}
              bicolorIcon={mapRouteToIcon(route.name as TabRouteName)}
              onPress={onPress}
            />
          )
        })}
        <Spacer.Row numberOfSpaces={4} />
      </RowContainer>
      <SafeAreaPlaceholder safeHeight={bottom} />
    </MainContainer>
  )
}

const RowContainer = styled.View({
  flexDirection: 'row',
  width: '100%',
})

const SafeAreaPlaceholder = styled.View<{ safeHeight: number }>(({ safeHeight }) => ({
  height: safeHeight,
}))

const MainContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  border: getSpacing(1 / 4),
  borderColor: theme.colors.greyLight,
  backgroundColor: theme.uniqueColors.tabBar,
  width: '100%',
  position: 'absolute',
  bottom: 0,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1 / 4),
    },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.2,
  }),
}))
