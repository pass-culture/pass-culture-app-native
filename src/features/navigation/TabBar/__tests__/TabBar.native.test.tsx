import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React from 'react'

import { DEFAULT_RADIUS } from 'features/location/components/SearchLocationModal'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { SuggestedPlace } from 'libs/place'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { TabBar } from '../TabBar'

const CUSTOM_AROUND_RADIUS = 37

jest.mock('features/navigation/TabBar/TabNavigationStateContext', () => {
  const { DEFAULT_TAB_ROUTES } = jest.requireActual(
    'features/navigation/TabBar/TabNavigationStateContext'
  )
  return { DEFAULT_TAB_ROUTES, useTabNavigationContext: jest.fn() }
})
const mockedUseTabNavigationContext = jest.mocked(useTabNavigationContext)

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

jest.mock('features/navigation/RootNavigator/routes', () => ({
  routes: [
    {
      name: 'TabNavigator',
      component: () => null,
      pathConfig: {
        initialRouteName: 'Home',
        screens: {
          Home: undefined,
          Search: undefined,
          Bookings: undefined,
          Favorites: undefined,
          Profile: undefined,
        },
      },
    },
  ],
}))

const navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> = {
  // @ts-expect-error : ignore type of emit to facilitate testing
  emit: jest.fn(() => ({ defaultPrevented: false })),
  navigate: jest.fn(),
}

let mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: jest.fn() }),
}))

let mockIsGeolocated = false
let mockIsCustomPosition = false
const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
jest.mock('libs/geolocation', () => ({
  useLocation: () => ({
    isGeolocated: mockIsGeolocated,
    isCustomPosition: mockIsCustomPosition,
    place: mockPlace,
  }),
}))

describe('TabBar', () => {
  beforeEach(() => {
    mockedUseTabNavigationContext.mockReturnValue({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Home',
      })),
    })
  })

  afterEach(() => {
    mockSearchState = initialSearchState
    mockIsGeolocated = false
    mockIsCustomPosition = false
  })

  // TODO(PC-13119): Add native stories for this component
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('render correctly', () => {
    renderTabBar()

    expect(screen).toMatchSnapshot()
  })

  it('should display the 5 following tabs with Home selected', async () => {
    renderTabBar()

    const expectedTabsTestIds = [
      'Accueil sélectionné',
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Mes favoris',
      'Mon profil',
    ].sort()

    expectedTabsTestIds.forEach((tab) => {
      expect(screen.getByTestId(tab)).toBeOnTheScreen()
    })
  })

  it('should display the 5 following tabs with Bookings selected', () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Bookings',
      })),
    })
    renderTabBar()
    const expectedTabsTestIds = [
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Mes réservations sélectionné',
      'Mes favoris',
      'Mon profil',
    ].sort()

    expectedTabsTestIds.forEach((tab) => {
      expect(screen.getByTestId(tab)).toBeOnTheScreen()
    })
  })

  it('displays only one selected at a time', () => {
    renderTabBar()

    expect(screen.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('does not reset navigation when clicked on selected tab', () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Profile',
      })),
    })
    renderTabBar()

    expect(screen.getByTestId('Mon profil sélectionné')).toBeOnTheScreen()

    const profileTab = screen.getByTestId('Mon profil')
    fireEvent.press(profileTab)

    expect(navigation.emit).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('should reset navigation when clicked on selected home tab', async () => {
    renderTabBar()

    expect(screen.getByTestId('Accueil sélectionné')).toBeOnTheScreen()

    const homeTab = screen.getByTestId('Accueil')
    fireEvent.press(homeTab)

    expect(navigation.emit).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('navigates to Profile on Profile tab click', async () => {
    renderTabBar()
    const profileTab = screen.getByTestId('Mon profil')

    fireEvent.press(profileTab)

    expect(navigation.navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Profile',
      params: undefined,
    })
  })

  it('should call navigate with searchState params on press "Recherche"', async () => {
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    fireEvent.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', initialSearchState)
    )
  })

  it('should call navigate with geolocation type on press "Recherche" when previous search was on a venue', async () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.VENUE,
        venue: {
          info: 'Paris',
          label: 'La librairie quantique DATA',
          venueId: 9384,
        },
      },
    }
    mockIsGeolocated = true
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    fireEvent.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
      })
    )
  })

  it('should call navigate with place type on press "Recherche" when previous search was on a venue', async () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.VENUE,
        venue: {
          info: 'Paris',
          label: 'La librairie quantique DATA',
          venueId: 9384,
        },
      },
    }
    mockIsCustomPosition = true
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    fireEvent.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        locationFilter: {
          locationType: LocationType.PLACE,
          aroundRadius: DEFAULT_RADIUS,
          place: mockPlace,
        },
      })
    )
  })

  it('should call navigate with place type and keep the around radius on press "Recherche" when previous search was on a place', async () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.PLACE,
        aroundRadius: CUSTOM_AROUND_RADIUS,
        place: mockPlace,
      },
    }
    mockIsCustomPosition = true
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    fireEvent.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        locationFilter: {
          locationType: LocationType.PLACE,
          aroundRadius: CUSTOM_AROUND_RADIUS,
          place: mockPlace,
        },
      })
    )
  })

  it('should call navigate with geolocation type and keep the around radius on press "Recherche" when previous search was on a geolocation', async () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.AROUND_ME,
        aroundRadius: CUSTOM_AROUND_RADIUS,
      },
    }
    mockIsGeolocated = true
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    fireEvent.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        locationFilter: {
          locationType: LocationType.AROUND_ME,
          aroundRadius: CUSTOM_AROUND_RADIUS,
        },
      })
    )
  })
})

function renderTabBar() {
  render(reactQueryProviderHOC(<TabBar navigation={navigation} />))
}
