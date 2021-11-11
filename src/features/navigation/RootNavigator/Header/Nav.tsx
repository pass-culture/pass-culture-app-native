import React from 'react'
import styled from 'styled-components/native'

import { BicolorFavoriteCount } from 'features/favorites/atoms/BicolorFavoriteCount'
import { navigationRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getShadow, getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { NavItem } from './NavItem'

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

type NavProps = {
  maxWidth?: number
  height?: number
  noShadow?: boolean
}

export const Nav: React.FC<NavProps> = ({ maxWidth, height, noShadow }) => {
  const { tabRoutes } = useTabNavigationContext()
  const { bottom } = useCustomSafeInsets()
  return (
    <MainContainer maxWidth={maxWidth} height={height} noShadow={noShadow}>
      <RowContainer>
        <Spacer.Row numberOfSpaces={4} />
        {tabRoutes.map((route) => {
          const onPress = () => {
            navigationRef?.current?.navigate(...getTabNavConfig(route.name, undefined))
          }
          return (
            <NavItem
              height={height}
              key={`key-tab-nav-${route.name}`}
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
})

const SafeAreaPlaceholder = styled.View<{ safeHeight: number }>(({ safeHeight }) => ({
  height: safeHeight,
}))

const MainContainer = styled.View<{
  maxWidth?: number
  height?: number
  noShadow?: boolean
}>(({ maxWidth, theme, height, noShadow }) => ({
  height: height ?? theme.appBarHeight,
  alignItems: 'center',
  backgroundColor: 'transparent',
  width: '100%',
  maxWidth,
  position: 'absolute',
  bottom: 0,
  zIndex: theme.zIndexHeaderNav,
  ...(!noShadow
    ? getShadow({
        shadowOffset: {
          width: 0,
          height: getSpacing(1 / 4),
        },
        shadowRadius: getSpacing(1),
        shadowColor: theme.colors.black,
        shadowOpacity: 0.2,
      })
    : {}),
}))
