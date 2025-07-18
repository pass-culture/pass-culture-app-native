jest.mock('features/navigation/TabBar/helpers', () => ({
  getTabHookConfig: jest.fn((name, config) => ({ name, config })),
}))

import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { getTabNavigatorConfig } from 'features/navigation/RootNavigator/Header/getTabNavigatorConfig'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { TabStateRoute } from 'features/navigation/TabBar/TabStackNavigatorTypes'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

describe('getTabNavigatorConfig', () => {
  const mockGetTabHookConfig = getTabHookConfig as jest.Mock

  beforeEach(() => {
    mockGetTabHookConfig.mockClear()
  })

  describe('for non-SearchStackNavigator routes', () => {
    const homeRoute: TabStateRoute = { name: 'Home', key: 'home-initial', isSelected: true }

    it('should call getTabNavigationConfig with received route', () => {
      getTabNavigatorConfig(homeRoute, initialSearchState)

      expect(mockGetTabHookConfig).toHaveBeenCalledWith('Home')
    })
  })

  describe('for SearchStackNavigator route', () => {
    const searchRouteSelected: TabStateRoute = {
      name: 'SearchStackNavigator',
      key: 'search-initial',
      isSelected: true,
    }

    const searchRouteNotSelected: TabStateRoute = {
      name: 'SearchStackNavigator',
      key: 'search-initial',
      isSelected: false,
    }

    const mockedPlace: SuggestedPlace = {
      label: 'Kourou',
      info: 'Guyane',
      type: 'street',
      geolocation: { longitude: -52.669736, latitude: 5.16186 },
    }

    const mockedSearchState = {
      ...initialSearchState,
      accessibilityFilter: defaultDisabilitiesProperties,
    }

    it('should return config with empty params when route is not selected', () => {
      getTabNavigatorConfig(searchRouteNotSelected, initialSearchState)

      expect(mockGetTabHookConfig).toHaveBeenCalledWith('SearchStackNavigator', {
        screen: 'SearchLanding',
        params: {},
      })
    })

    it('should return config with searchState reinitialized except for location when route is selected', () => {
      const mockedLocation = {
        locationType: LocationMode.AROUND_ME,
        aroundRadius: 10,
        place: mockedPlace,
      }

      getTabNavigatorConfig(searchRouteSelected, {
        ...mockedSearchState,
        query: 'hello',
        locationFilter: mockedLocation,
      })

      expect(mockGetTabHookConfig).toHaveBeenCalledWith('SearchStackNavigator', {
        screen: 'SearchLanding',
        params: { ...mockedSearchState, query: '', locationFilter: mockedLocation },
      })
    })
  })
})
