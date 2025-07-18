import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { TabStateRoute } from 'features/navigation/TabBar/TabStackNavigatorTypes'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'

export const getTabNavigatorConfig = (route: TabStateRoute, searchState: SearchState) => {
  if (route.name !== 'SearchStackNavigator') {
    return getTabHookConfig(route.name)
  }

  const searchParams = route.isSelected
    ? {
        ...initialSearchState,
        locationFilter: searchState.locationFilter,
        accessibilityFilter: defaultDisabilitiesProperties,
      }
    : {}

  return getTabHookConfig(route.name, {
    screen: 'SearchLanding',
    params: searchParams,
  })
}
