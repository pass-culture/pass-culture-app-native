import React from 'react'
import styled from 'styled-components'

import { navigateFromRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabParamList } from 'features/navigation/TabBar/types'
import { theme } from 'theme'
import { Spacer, getShadow, getSpacing } from 'ui/theme'
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

  const onPress = (name: keyof TabParamList) => {
    navigateFromRef(...getTabNavConfig(name, undefined))
  }

  return (
    <NavItemsContainer maxWidth={maxWidth} height={height} noShadow={noShadow}>
      <Ul>
        {tabRoutes.map((route, index) => (
          <StyledLi key={`key-tab-nav-${route.name}`}>
            {index > 0 && <Spacer.Row numberOfSpaces={1.5} />}
            <NavItem
              tabName={route.name}
              isSelected={route.isSelected}
              BicolorIcon={mapTabRouteToBicolorIcon(route.name)}
              to={{ screen: route.name, params: undefined }}
              onPress={() => onPress(route.name)}
            />
          </StyledLi>
        ))}
      </Ul>
    </NavItemsContainer>
  )
}

const NavItemsContainer = styled.nav<{
  maxWidth?: number
  height?: number
  noShadow?: boolean
}>(({ maxWidth, height, noShadow }) => ({
  display: 'flex',
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

const StyledLi = styled(Li)({
  display: 'flex',
})
