import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { navigationRef } from 'features/navigation/navigationRef'
import * as useGoBack from 'features/navigation/useGoBack'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchView, SearchState } from 'features/search/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, fireEvent, render, screen } from 'tests/utils'
import { expectCurrentRouteToBe } from 'tests/utils/navigation'

import { SearchBox } from './SearchBox'

let mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
let mockIsFocusOnSuggestions = false
const mockHideSuggestions = jest.fn()
const mockShowSuggestions = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
    isFocusOnSuggestions: mockIsFocusOnSuggestions,
    hideSuggestions: mockHideSuggestions,
    showSuggestions: mockShowSuggestions,
  }),
}))

jest.mock('libs/firebase/analytics')

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
  }),
}))

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)
const mockClear = jest.fn()
let mockQuery = ''
jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({
    query: mockQuery,
    refine: jest.fn,
    clear: mockClear,
  }),
}))

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: Position = DEFAULT_POSITION

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    place: null,
    onModalHideRef: jest.fn(),
    isCurrentLocationMode: jest.fn(),
  }),
}))

jest.mock('features/navigation/navigationRef')

const mockRoutes = [
  { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'Bookings' } },
  {
    key: 'TabNavigator2',
    name: 'TabNavigator',
    params: {
      screen: 'SearchStackNavigator',
      params: { screen: 'SearchResults' },
    },
  },
]

const mockRoutesWithVenue = [
  { key: 'Venue1', name: 'Venue', params: { id: 22912 } },
  {
    key: 'TabNavigator2',
    name: 'TabNavigator',
    params: {
      screen: 'SearchStackNavigator',
      params: { screen: 'SearchResults' },
    },
  },
]

const venue = mockedSuggestedVenue

const searchId = uuidv4()

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.useFakeTimers()

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('libs/firebase/analytics/analytics')

describe('SearchBox component', () => {
  beforeEach(() => {
    jest.spyOn(navigationRef, 'getState').mockReturnValue({
      key: 'Navigator',
      index: 1,
      routeNames: ['TabNavigator'],
      routes: mockRoutes,
      type: 'tab',
      stale: false,
    })
  })

  afterEach(() => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
      priceRange: [0, 20],
    }
    mockQuery = ''
    mockIsFocusOnSuggestions = false
  })

  it('should render SearchBox', async () => {
    renderSearchBox()
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should render SearchBox when FF is enabled', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderSearchBox()

    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should set search state on submit', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })
    })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        query: 'jazzaza',
        offerCategories: mockSearchState.offerCategories,
        priceRange: mockSearchState.priceRange,
        searchId,
      },
    })
  })

  it('should navigate to search results on submit', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })
    })

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: {
          ...initialSearchState,
          query: 'jazzaza',
          offerCategories: mockSearchState.offerCategories,
          priceRange: mockSearchState.priceRange,
          searchId,
          accessibilityFilter: {
            isAudioDisabilityCompliant: undefined,
            isMentalDisabilityCompliant: undefined,
            isMotorDisabilityCompliant: undefined,
            isVisualDisabilityCompliant: undefined,
          },
        },
        screen: 'SearchResults',
      },
      screen: 'SearchStackNavigator',
    })
  })

  it('should not show back button when being on the search landing view', async () => {
    renderSearchBox()

    const previousButton = screen.queryByTestId('Revenir en arrière')

    expect(previousButton).not.toBeOnTheScreen()
  })

  it('should show back button when being on the search results view', async () => {
    useRoute.mockReturnValueOnce({ name: SearchView.Results })

    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    expect(previousButton).toBeOnTheScreen()
  })

  it('should show back button when being focus on suggestions', async () => {
    mockIsFocusOnSuggestions = true
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    expect(previousButton).toBeOnTheScreen()
  })

  it('should show the text typed by the user', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')
    fireEvent(searchInput, 'onChangeText', 'Some text')

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should not execute a search if input is empty', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: '' } })

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  describe('With autocomplete', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableAutocomplete: true } })
    })

    it('should unfocus from suggestion when being focus on the suggestions and press back button', async () => {
      mockIsFocusOnSuggestions = true
      useRoute.mockReturnValueOnce({ name: SearchView.Landing })

      renderSearchBox()
      const previousButton = screen.getByTestId('Revenir en arrière')

      fireEvent.press(previousButton)

      expect(mockHideSuggestions).toHaveBeenNthCalledWith(1)
    })

    it('should hide suggestions when being focus on suggestions and press back button on landing view', async () => {
      mockIsFocusOnSuggestions = true
      useRoute.mockReturnValueOnce({ name: SearchView.Landing })

      renderSearchBox()

      const previousButton = screen.getByTestId('Revenir en arrière')

      fireEvent.press(previousButton)

      expect(mockHideSuggestions).toHaveBeenNthCalledWith(1)
    })

    it('should reset input when user click on reset icon when being focus on suggestions', async () => {
      mockIsFocusOnSuggestions = true
      mockSearchState = {
        ...mockSearchState,
        query: 'Some text',
      }
      mockQuery = 'Some text'
      renderSearchBox()

      const resetIcon = await screen.findByTestId('Réinitialiser la recherche')
      fireEvent.press(resetIcon)

      expect(screen.queryByText('Some text')).not.toBeOnTheScreen()

      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  describe('Without autocomplete', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableAutocomplete: false } })
    })

    it('should stay on the current view when focusing search input and being on the %s view', async () => {
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      fireEvent(searchInput, 'onFocus')

      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should reset input when user click on reset icon when being focus on the suggestions view', async () => {
      mockIsFocusOnSuggestions = true
      mockSearchState = {
        ...mockSearchState,
        query: 'Some text',
      }
      mockQuery = 'Some text'
      renderSearchBox()

      const resetIcon = screen.getByTestId('Réinitialiser la recherche')
      fireEvent.press(resetIcon)

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...mockSearchState,
          query: '',
        },
      })
      expect(mockClear).toHaveBeenCalledTimes(1)
    })

    it('should reset input when user click on reset icon when being on the search results view when isDesktopViewport', async () => {
      mockSearchState = {
        ...mockSearchState,
        query: 'Some text',
      }
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      mockQuery = 'Some text'
      renderSearchBox(true)

      const resetIcon = screen.getByTestId('Réinitialiser la recherche')
      fireEvent.press(resetIcon)

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...mockSearchState,
          query: '',
        },
      })
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  it('should reset searchState when user go goBack to Landing', async () => {
    mockSearchState = {
      ...mockSearchState,
      query: 'Some text',
    }
    useRoute.mockReturnValueOnce({ name: SearchView.Results })

    mockQuery = 'Some text'
    renderSearchBox(true)

    const goBackIcon = screen.getByTestId('icon-back')
    fireEvent.press(goBackIcon)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: initialSearchState,
    })
  })

  it('should execute a search if input is not empty', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        query: 'jazzaza',
        offerCategories: mockSearchState.offerCategories,
        priceRange: mockSearchState.priceRange,
        searchId,
      },
    })
  })

  it('should display suggestions when focusing search input and no search executed', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    fireEvent(searchInput, 'onFocus')

    expect(mockShowSuggestions).toHaveBeenNthCalledWith(1)
  })

  it('should hide the search filter button when being on the search landing view', async () => {
    mockSearchState = {
      ...mockSearchState,
      query: 'la fnac',
    }
    useRoute.mockReturnValueOnce({ name: SearchView.Landing })

    renderSearchBox()

    await act(async () => {
      expect(screen.queryByTestId(/Voir tous les filtres/)).not.toBeOnTheScreen()
    })
  })

  it('should hide the search filter button when being on the search result view and being focus on the suggestion', async () => {
    mockIsFocusOnSuggestions = true
    mockSearchState = {
      ...mockSearchState,
      query: 'la fnac',
    }
    useRoute.mockReturnValueOnce({ name: SearchView.Results })

    renderSearchBox()

    await act(async () => {
      expect(screen.queryByTestId(/Voir tous les filtres/)).not.toBeOnTheScreen()
    })
  })

  it(`should not display Le Petit Rintintin 1 in location search widget when a venue is selected`, async () => {
    mockSearchState = { ...initialSearchState, venue }
    useRoute.mockReturnValueOnce({ name: SearchView.Results })

    renderSearchBox()

    expect(screen.queryByText(venue.label)).not.toBeOnTheScreen()
  })

  it('should not display locationSearchWidget when isDesktopViewport = true', async () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationMode.EVERYWHERE },
    }
    useRoute.mockReturnValueOnce({ name: SearchView.Results })

    mockPosition = DEFAULT_POSITION
    renderSearchBox()

    await act(async () => {})

    expect(screen.getByText('Me localiser')).toBeOnTheScreen()
  })
})

jest.mock('libs/firebase/analytics/analytics')

describe('<SearchBox /> with SearchN1 as previous route on search results', () => {
  const previousRouteName = 'TabNavigator'
  const currentRouteName = 'SearchN1'

  const mockRoutesWithSearchN1 = [
    { key: currentRouteName, name: currentRouteName },
    { key: previousRouteName, name: previousRouteName },
  ]

  beforeEach(() => {
    jest.spyOn(navigationRef, 'getState').mockReturnValue({
      key: 'Navigator',
      index: 1,
      routeNames: ['TabNavigator'],
      routes: mockRoutesWithSearchN1,
      type: 'tab',
      stale: false,
    })
    useRoute.mockReturnValue({ name: SearchView.Results })
  })

  it('should set the view to Landing when the user press the back button', async () => {
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    fireEvent.press(previousButton)

    expectCurrentRouteToBe(previousRouteName)
  })
})

describe('SearchBox component with venue previous route on search results', () => {
  beforeEach(() => {
    jest.spyOn(navigationRef, 'getState').mockReturnValue({
      key: 'Navigator',
      index: 1,
      routeNames: ['TabNavigator'],
      routes: mockRoutesWithVenue,
      type: 'tab',
      stale: false,
    })
    useRoute.mockReturnValue({ name: SearchView.Results })
  })

  it('should unselect the venue and set the view to Landing when current route is search and previous route is Venue when the user press the back button', async () => {
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    fireEvent.press(previousButton)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: { ...mockSearchState, venue: undefined },
    })
  })

  it('should execute go back when current route is search and previous route is Venue', async () => {
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    fireEvent.press(previousButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})

function renderSearchBox(isDesktopViewport?: boolean) {
  return render(
    <DummySearchBox />,

    { theme: { isDesktopViewport: isDesktopViewport ?? false } }
  )
}

const DummySearchBox = () => {
  const searchInputID = uuidv4()

  return (
    <React.Fragment>
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    </React.Fragment>
  )
}
