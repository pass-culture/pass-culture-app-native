import React from 'react'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { theme } from 'theme'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { Spacer, getShadow, getSpacing } from 'ui/theme'

import { NavItem } from './NavItem'

type Props = {
  maxWidth?: number
  height?: number
  noShadow?: boolean
}

export const Nav: React.FC<Props> = ({ maxWidth, height, noShadow }) => {
  const { tabRoutes } = useTabNavigationContext()
  const {
    searchState: { locationFilter },
  } = useSearch()
  const { hideSuggestions } = useSearch()

  return (
    <NavItemsContainer
      accessibilityRole={AccessibilityRole.NAVIGATION}
      maxWidth={maxWidth}
      navHeight={height}
      noShadow={noShadow}>
      <Ul>
        {tabRoutes.map((route, index) => {
          let params = undefined
          if (route.isSelected && route.name === 'Search') {
            params = { ...initialSearchState, locationFilter }
          }
          const tabNavConfig = getTabNavConfig(route.name, params)
          return (
            <StyledLi key={`key-tab-nav-${route.name}`}>
              {index > 0 && <Spacer.Row numberOfSpaces={1.5} />}
              <NavItem
                tabName={route.name}
                isSelected={route.isSelected}
                BicolorIcon={mapTabRouteToBicolorIcon(route.name)}
                onBeforeNavigate={route.name === 'Search' ? hideSuggestions : undefined}
                navigateTo={{
                  screen: tabNavConfig[0],
                  params: tabNavConfig[1],
                  fromRef: true,
                  withPush: true,
                }}
              />
            </StyledLi>
          )
        })}
      </Ul>
    </NavItemsContainer>
  )
}

const NavItemsContainer = styled.View<{
  maxWidth?: number
  navHeight?: number
  noShadow?: boolean
}>(({ maxWidth, navHeight, noShadow }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: navHeight ?? theme.appBarHeight,
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
  flexDirection: 'row',
})
