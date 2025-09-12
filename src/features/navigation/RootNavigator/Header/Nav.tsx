import React from 'react'
import styled from 'styled-components/native'

import { getTabNavigatorConfig } from 'features/navigation/RootNavigator/Header/getTabNavigatorConfig'
import { mapTabRouteToIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabParamList } from 'features/navigation/TabBar/TabStackNavigatorTypes'
import { useSearch } from 'features/search/context/SearchWrapper'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { Spacer } from 'ui/theme'

import { NavItem } from './NavItem'

type Props = {
  maxWidth?: number
  height?: number
  routeBadgeMap?: Partial<Record<keyof TabParamList, number>>
}

export const Nav: React.FC<Props> = ({ maxWidth, height, routeBadgeMap }) => {
  const enableReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { tabRoutes } = useTabNavigationContext()
  const { searchState, hideSuggestions } = useSearch()

  return (
    <NavItemsContainer
      accessibilityRole={AccessibilityRole.NAVIGATION}
      maxWidth={maxWidth}
      navHeight={height}>
      <Ul>
        {tabRoutes.map((route, index) => {
          const tabNavigationConfig = getTabNavigatorConfig(route, searchState)
          return (
            <StyledLi key={`key-tab-nav-${route.name}`}>
              {index > 0 ? <Spacer.Row numberOfSpaces={1.5} /> : null}
              <NavItem
                tabName={route.name}
                isSelected={route.isSelected}
                BicolorIcon={mapTabRouteToIcon({ route: route.name, enableReactionFeature })}
                onBeforeNavigate={
                  route.name === 'SearchStackNavigator' ? hideSuggestions : undefined
                }
                badgeValue={routeBadgeMap?.[route.name]}
                navigateTo={{
                  screen: tabNavigationConfig[0],
                  params: tabNavigationConfig[1],
                  fromRef: true,
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
}>(({ theme, maxWidth, navHeight }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: navHeight ?? theme.appBarHeight,
  width: '100%',
  maxWidth,
  position: 'absolute',
  zIndex: theme.zIndex.headerNav,
}))

const StyledLi = styled(Li)({
  display: 'flex',
  flexDirection: 'row',
})
