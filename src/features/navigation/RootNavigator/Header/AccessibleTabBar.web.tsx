import React from 'react'
import styled from 'styled-components'

import { useCurrentRoute } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { TabBarComponent } from 'features/navigation/TabBar/TabBarComponent'
import { TabBarContainer } from 'features/navigation/TabBar/TabBarContainer'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabParamList, TabRouteName } from 'features/navigation/TabBar/types'
import { Link } from 'ui/web/link/Link'
import { Li } from 'ui/web/list/Li'
import { Ul } from 'ui/web/list/Ul'

export const AccessibleTabBar = () => {
  const { tabRoutes } = useTabNavigationContext()
  const currentRoute = useCurrentRoute()

  if (currentRoute && currentRoute.name !== 'TabNavigator') return null

  const onPress = (name: keyof TabParamList) => {
    navigateFromRef(...getTabNavConfig(name, undefined))
  }

  return (
    <AccessibleTabBarContainer>
      <TabBarContainer>
        <StyledUl>
          {tabRoutes.map((route) => {
            return (
              <LinkContainer key={route.name}>
                <Link to={{ screen: route.name, params: undefined }} accessible={false}>
                  <TabBarComponent
                    tabName={route.name}
                    isSelected={route.isSelected}
                    BicolorIcon={mapTabRouteToBicolorIcon(route.name as TabRouteName)}
                    onPress={() => onPress(route.name)}
                  />
                </Link>
              </LinkContainer>
            )
          })}
        </StyledUl>
      </TabBarContainer>
    </AccessibleTabBarContainer>
  )
}

const AccessibleTabBarContainer = styled.nav(({ theme }) => ({
  zIndex: theme.zIndex.tabBar,
}))

const StyledUl = styled(Ul)({
  flex: 1,
  overflow: 'visible',
})

const LinkContainer = styled(Li)({
  display: 'flex',
  flex: 1,
  '> *': {
    display: 'flex',
    flex: 1,
  },
})
