import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { DEFAULT_RADIUS } from 'features/location/components/SearchLocationModal'
import * as navigationRefAPI from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { SuggestedPlace } from 'libs/place'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils/web'

import { AccessibleTabBar } from './AccessibleTabBar'

const CUSTOM_AROUND_RADIUS = 37
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
}))
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

describe('AccessibleTabBar', () => {
  afterEach(() => {
    mockSearchState = initialSearchState
    mockIsGeolocated = false
    mockIsCustomPosition = false
  })

  it('renders correctly', () => {
    const renderAPI = renderTabBar()

    expect(renderAPI).toMatchSnapshot()
  })

  it('should display the 5 following tabs', () => {
    renderTabBar()
    const expectedTabsTestIds = [
      'Accueil sélectionné',
      'Rechercher des offres',
      'Mes réservations',
      'Favoris',
      'Mon profil',
    ]

    expectedTabsTestIds.forEach((tab) => {
      expect(screen.getByTestId(tab)).toBeInTheDocument()
    })
  })

  it('displays only one selected at a time', () => {
    renderTabBar()

    expect(screen.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('should identify only one tab as current page', () => {
    renderTabBar()
    const tabsTestIds = [
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Favoris',
      'Mon profil',
    ]
    const tabs = tabsTestIds.map((testID) => screen.getByTestId(testID))

    const currentPageList = tabs
      .map((tab) => tab.getAttribute('aria-current'))
      .filter((attr) => !!attr)

    expect(currentPageList).toHaveLength(1)
  })

  it('should call navigate with initialSearchState params on press "Recherche"', async () => {
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    await act(() => {
      fireEvent.click(searchButton)
    })

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
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
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    await act(() => {
      fireEvent.click(searchButton)
    })

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
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
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    await act(() => {
      fireEvent.click(searchButton)
    })

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
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
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    await act(() => {
      fireEvent.click(searchButton)
    })

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
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
    const navigateFromRefSpy = jest.spyOn(navigationRefAPI, 'navigateFromRef')
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    await act(() => {
      fireEvent.click(searchButton)
    })

    expect(navigateFromRefSpy).toHaveBeenCalledWith(
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
  return render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <AccessibleTabBar id="tabBarID" />
      </NavigationContainer>
    )
  )
}
