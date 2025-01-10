import React from 'react'
import styled from 'styled-components'
import nativeStyled from 'styled-components/native'

import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabBarComponent } from 'features/navigation/TabBar/TabBarComponent'
import { TabBarContainer } from 'features/navigation/TabBar/TabBarContainer'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'

export const AccessibleTabBar = ({ id }: { id: string }) => {
  const { tabRoutes } = useTabNavigationContext()
  const currentRoute = useCurrentRoute()
  const { searchState, hideSuggestions } = useSearch()
  const { disabilities } = useAccessibilityFiltersContext()
  const routeBadgeMap = useTabBarItemBadges()

  if (currentRoute && currentRoute.name !== 'TabNavigator') return null

  return (
    <AccessibleTabBarContainer id={id}>
      <TabBarContainer>
        <StyledUl>
          {tabRoutes.map((route) => {
            let tabNavConfig = getTabNavConfig(route.name)
            if (route.name === 'SearchStackNavigator') {
              const searchParams = route.isSelected
                ? {
                    ...initialSearchState,
                    locationFilter: searchState.locationFilter,
                    accessibilityFilter: defaultDisabilitiesProperties,
                  }
                : { ...searchState, accessibilityFilter: disabilities }
              tabNavConfig = getTabNavConfig(route.name, {
                screen: 'SearchLanding',
                params: searchParams,
              })
            }
            return (
              <LinkContainer key={route.name}>
                <TabBarComponent
                  navigateTo={{ screen: tabNavConfig[0], params: tabNavConfig[1], fromRef: true }}
                  onPress={route.name === 'SearchStackNavigator' ? hideSuggestions : undefined}
                  tabName={route.name}
                  isSelected={route.isSelected}
                  badgeValue={routeBadgeMap[route.name]}
                />
              </LinkContainer>
            )
          })}
        </StyledUl>
      </TabBarContainer>
    </AccessibleTabBarContainer>
  )
}

const AccessibleTabBarContainer = styled.nav.attrs({ role: 'navigation' })(({ theme }) => ({
  zIndex: theme.zIndex.tabBar,
}))

const StyledUl = nativeStyled(Ul)({
  flex: 1,
  overflow: 'visible',
})

const LinkContainer = nativeStyled(Li)({
  flex: 1,
})
