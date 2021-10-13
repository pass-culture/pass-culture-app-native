import React from 'react'
import styled from 'styled-components/native'

import { BicolorFavoriteCount } from 'features/favorites/atoms/BicolorFavoriteCount'
import { navigationRef } from 'features/navigation/navigationRef'
import { isPrivateScreen } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabParamList, TabRouteName } from 'features/navigation/TabBar/types'
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

export type NavRoute = { name: keyof TabParamList }

export type NavState = {
  index: number
  routes: Array<NavRoute>
}

type NavProps = {
  maxWidth?: number
  height?: number
  noShadow?: boolean
  hidden?: boolean
  state: NavState
}

export const Nav: React.FC<NavProps> = ({ state, maxWidth, height, noShadow, hidden }) => {
  const { bottom } = useCustomSafeInsets()
  if (hidden) {
    return null
  }
  return (
    <MainContainer maxWidth={maxWidth} height={height} noShadow={noShadow}>
      <RowContainer>
        <Spacer.Row numberOfSpaces={4} />
        {state.routes.map((route, index) => {
          if (isPrivateScreen(route.name)) return null
          const isSelected = state.index === index
          const onPress = () => {
            if (isSelected) return
            navigationRef?.current?.navigate(...getTabNavConfig(route.name, undefined))
          }
          return (
            <NavItem
              height={height}
              key={`key-tab-nav-${index}-${route.name}`}
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
