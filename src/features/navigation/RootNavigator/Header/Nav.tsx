import React from 'react'
import styled from 'styled-components/native'

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { mapTabRouteToBicolorIcon } from 'features/navigation/TabBar/mapTabRouteToBicolorIcon'
import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabParamList } from 'features/navigation/TabBar/types'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { theme } from 'theme'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { Spacer, getShadow, getSpacing } from 'ui/theme'

import { NavItem } from './NavItem'

type Props = {
  maxWidth?: number
  height?: number
  noShadow?: boolean
  routeBadgeMap?: Partial<Record<keyof TabParamList, number>>
}

export const Nav: React.FC<Props> = ({ maxWidth, height, noShadow, routeBadgeMap }) => {
  const enableNavBarV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_TAB_BAR)
  const enableReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { tabRoutes } = useTabNavigationContext()
  const {
    searchState: { locationFilter },
    hideSuggestions,
  } = useSearch()

  return (
    <NavItemsContainer
      accessibilityRole={AccessibilityRole.NAVIGATION}
      maxWidth={maxWidth}
      navHeight={height}
      noShadow={noShadow}>
      <Ul>
        {tabRoutes.map((route, index) => {
          let tabNavConfig = getTabNavConfig(route.name)

          if (route.isSelected && route.name === 'SearchStackNavigator') {
            tabNavConfig = getSearchStackConfig('SearchLanding', {
              ...initialSearchState,
              locationFilter,
              accessibilityFilter: defaultDisabilitiesProperties,
            })
          }
          return (
            <StyledLi key={`key-tab-nav-${route.name}`}>
              {index > 0 ? <Spacer.Row numberOfSpaces={1.5} /> : null}
              <NavItem
                tabName={route.name}
                isSelected={route.isSelected}
                BicolorIcon={mapTabRouteToBicolorIcon({
                  route: route.name,
                  v2: enableNavBarV2,
                  enableReactionFeature,
                })}
                onBeforeNavigate={
                  route.name === 'SearchStackNavigator' ? hideSuggestions : undefined
                }
                badgeValue={routeBadgeMap?.[route.name]}
                navigateTo={{
                  screen: tabNavConfig[0],
                  params: tabNavConfig[1],
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
  ...(noShadow
    ? {}
    : getShadow({
        shadowOffset: { width: 0, height: getSpacing(1 / 4) },
        shadowRadius: getSpacing(1),
        shadowColor: theme.colors.black,
        shadowOpacity: 0.2,
      })),
}))

const StyledLi = styled(Li)({
  display: 'flex',
  flexDirection: 'row',
})
