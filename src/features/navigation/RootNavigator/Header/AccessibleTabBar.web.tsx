import React from 'react'
import styled from 'styled-components'
import nativeStyled from 'styled-components/native'

import { useCurrentRoute } from 'features/navigation/helpers'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { TabBarComponent } from 'features/navigation/TabBar/TabBarComponent'
import { TabBarContainer } from 'features/navigation/TabBar/TabBarContainer'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { useSearch } from 'features/search/context/SearchWrapper'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'

export const AccessibleTabBar = ({ id }: { id: string }) => {
  const { tabRoutes } = useTabNavigationContext()
  const currentRoute = useCurrentRoute()
  const { searchState } = useSearch()

  if (currentRoute && currentRoute.name !== 'TabNavigator') return null

  return (
    <AccessibleTabBarContainer id={id}>
      <TabBarContainer>
        <StyledUl>
          {tabRoutes.map((route) => {
            const params = route.name === 'Search' ? searchState : undefined
            const tabNavConfig = getTabNavConfig(route.name, params)
            return (
              <LinkContainer key={route.name}>
                <TabBarComponent
                  navigateTo={{ screen: tabNavConfig[0], params: tabNavConfig[1], fromRef: true }}
                  tabName={route.name}
                  isSelected={route.isSelected}
                  BicolorIcon={mapTabRouteToBicolorIcon(route.name)}
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
