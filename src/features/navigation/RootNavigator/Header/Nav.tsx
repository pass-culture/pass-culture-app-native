import React from 'react'
import styled from 'styled-components/native'

import { navigateFromRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { Spacer, getShadow, getSpacing } from 'ui/theme'
import { A } from 'ui/web/link/A'
import { Li } from 'ui/web/list/Li'
import { Ul } from 'ui/web/list/Ul'

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
      <Ul>
        {tabRoutes.map((route, index) => {
          const onPress = () => {
            navigateFromRef(...getTabNavConfig(route.name, undefined))
          }
          const key = `key-tab-nav-${route.name}`
          function renderNavItem() {
            return (
              <Li key={key}>
                <A href={route.path}>
                  <NavItem
                    tabName={route.name}
                    isSelected={route.isSelected}
                    BicolorIcon={mapTabRouteToBicolorIcon(route.name)}
                    onPress={onPress}
                  />
                </A>
              </Li>
            )
          }
          if (index === 0) return renderNavItem()
          return (
            <React.Fragment key={key}>
              <Spacer.Row numberOfSpaces={1.5} />
              {renderNavItem()}
            </React.Fragment>
          )
        })}
      </Ul>
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
  zIndex: theme.zIndex.headerNav,
  ...(!noShadow
    ? getShadow({
        shadowOffset: { width: 0, height: getSpacing(1 / 4) },
        shadowRadius: getSpacing(1),
        shadowColor: theme.colors.black,
        shadowOpacity: 0.2,
      })
    : {}),
}))
