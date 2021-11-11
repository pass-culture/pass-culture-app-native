import React from 'react'
import styled from 'styled-components/native'

import { navigationRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { getShadow, getSpacing } from 'ui/theme'

import { NavItem } from './NavItem'

type Props = {
  maxWidth?: number
  height?: number
  noShadow?: boolean
}

export const Nav: React.FC<Props> = ({ maxWidth, height, noShadow }) => {
  const { tabRoutes } = useTabNavigationContext()
  return (
    <NavItemsContainer maxWidth={maxWidth} height={height} noShadow={noShadow}>
      {tabRoutes.map((route) => {
        const onPress = () => {
          navigationRef?.current?.navigate(...getTabNavConfig(route.name, undefined))
        }
        return (
          <NavItem
            key={`key-tab-nav-${route.name}`}
            tabName={route.name}
            isSelected={route.isSelected}
            BicolorIcon={mapTabRouteToBicolorIcon(route.name as TabRouteName)}
            onPress={onPress}
          />
        )
      })}
    </NavItemsContainer>
  )
}

const NavItemsContainer = styled.View<{
  maxWidth?: number
  height?: number
  noShadow?: boolean
}>(({ maxWidth, theme, height, noShadow }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: height ?? theme.appBarHeight,
  width: '100%',
  maxWidth,
  position: 'absolute',
  zIndex: theme.zIndexHeaderNav,
  ...(!noShadow
    ? getShadow({
        shadowOffset: { width: 0, height: getSpacing(1 / 4) },
        shadowRadius: getSpacing(1),
        shadowColor: theme.colors.black,
        shadowOpacity: 0.2,
      })
    : {}),
}))
