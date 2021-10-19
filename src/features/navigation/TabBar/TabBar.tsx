import { BottomTabBarOptions, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import styled from 'styled-components/native'

import { BicolorFavoriteCount } from 'features/favorites/atoms/BicolorFavoriteCount'
import { isPrivateScreen } from 'features/navigation/RootNavigator/linking/getScreensConfig'
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
  hidden?: boolean
} & Pick<BottomTabBarProps<BottomTabBarOptions>, 'state' | 'navigation'>

export const TabBar: React.FC<TabBarProps> = ({ navigation, state, hidden }) => {
  const { bottom } = useCustomSafeInsets()
  if (hidden) {
    return null
  }
  return (
    <MainContainer>
      <RowContainer>
        <Spacer.Row numberOfSpaces={4} />
        {state.routes.map((route, index) => {
          if (isPrivateScreen(route.name)) return null
          const isSelected = state.index === index
          const onPress = () => {
            if (isSelected) return
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
              key={`key-tab-nav-${index}-${route.key}`}
              tabName={route.name}
              isSelected={isSelected}
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
