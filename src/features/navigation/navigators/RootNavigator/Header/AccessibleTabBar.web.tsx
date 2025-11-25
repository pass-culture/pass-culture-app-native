import { Route } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components'
import nativeStyled from 'styled-components/native'

import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { getTabNavigatorConfig } from 'features/navigation/navigators/RootNavigator/Header/getTabNavigatorConfig'
import { TabBarComponent } from 'features/navigation/TabBar/TabBarComponent'
import { TabBarContainer } from 'features/navigation/TabBar/TabBarContainer'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { useSearch } from 'features/search/context/SearchWrapper'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'

export const AccessibleTabBar: FC<{ id: string; currentRoute?: Route<string> }> = ({
  id,
  currentRoute,
}) => {
  const { tabRoutes } = useTabNavigationContext()
  const { searchState, hideSuggestions } = useSearch()
  const routeBadgeMap = useTabBarItemBadges()

  if (currentRoute && currentRoute.name !== 'TabNavigator') return null

  return (
    <AccessibleTabBarContainer id={id}>
      <TabBarContainer>
        <StyledUl>
          {tabRoutes.map((route) => {
            const tabNavigationConfig = getTabNavigatorConfig(route, searchState)
            return (
              <LinkContainer key={route.name}>
                <TabBarComponent
                  navigateTo={{
                    screen: tabNavigationConfig[0],
                    params: tabNavigationConfig[1],
                    fromRef: true,
                  }}
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
