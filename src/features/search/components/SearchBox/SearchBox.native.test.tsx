import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigationRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/context/reducer'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { LocationFilter, SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, fireEvent, render, screen } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

import { SearchBox } from './SearchBox'

let mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

jest.mock('libs/firebase/analytics')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

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
jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({
    query: '',
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
    params: { screen: 'Search', params: { view: SearchView.Results } },
  },
]

const mockRoutesWithVenue = [
  { key: 'Venue1', name: 'Venue', params: { id: 22912 } },
  {
    key: 'TabNavigator2',
    name: 'TabNavigator',
    params: { screen: 'Search', params: { view: SearchView.Results } },
  },
]

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue: Venue = mockedSuggestedVenues[0]

const searchId = uuidv4()

jest.useFakeTimers({ legacyFakeTimers: true })

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
  })

  it('should render SearchBox', async () => {
    renderSearchBox()
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should call navigate on submit', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })
    })

    expect(navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        view: SearchView.Results,
        offerCategories: mockSearchState.offerCategories,
        priceRange: mockSearchState.priceRange,
        searchId,
      })
    )
  })

  it('should not show back button when being on the search landing view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    renderSearchBox()

    const previousButton = screen.queryByTestId('Revenir en arrière')

    await act(async () => {
      expect(previousButton).not.toBeOnTheScreen()
    })
  })

  it('should show back button when being on the search results view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results } })
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      expect(previousButton).toBeOnTheScreen()
    })
  })

  it('should show back button when being on the suggestions view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      expect(previousButton).toBeOnTheScreen()
    })
  })

  it('should show the text typed by the user', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')
    await act(async () => {
      fireEvent(searchInput, 'onChangeText', 'Some text')
    })

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should not execute a search if input is empty', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: '' } })
    })

    expect(navigate).not.toHaveBeenCalled()
  })

  describe('With autocomplete', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableAutocomplete: true } })
    })

    it('should redirect on results view when being on the suggestions view and press back button and previous view is results view', async () => {
      useRoute.mockReturnValueOnce({
        params: { view: SearchView.Suggestions, previousView: SearchView.Results },
      })

      renderSearchBox()

      const previousButton = screen.getByTestId('Revenir en arrière')

      await act(async () => {
        fireEvent.press(previousButton)
      })

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          view: SearchView.Results,
          previousView: SearchView.Results,
          offerCategories: mockSearchState.offerCategories,
          priceRange: mockSearchState.priceRange,
        })
      )
    })

    it.each([[undefined], [SearchView.Landing]])(
      'should redirect on landing view when being on the suggestions view and press back button and previous view is %s view',
      async (previousView) => {
        useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, previousView } })
        renderSearchBox()

        const previousButton = screen.getByTestId('Revenir en arrière')

        await act(async () => {
          fireEvent.press(previousButton)
        })

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
          })
        )
      }
    )

    it('should not reset location to eveywhere when current and previous views are not identical', async () => {
      useRoute.mockReturnValueOnce({
        params: { view: SearchView.Results, previousView: SearchView.Results },
      })
      renderSearchBox()

      const previousButton = screen.getByTestId('Revenir en arrière')

      await act(async () => {
        fireEvent.press(previousButton)
      })

      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should not execute go back when current and previous views are not identical', async () => {
      useRoute.mockReturnValueOnce({
        params: { view: SearchView.Results, previousView: SearchView.Results },
      })
      renderSearchBox()

      const previousButton = screen.getByTestId('Revenir en arrière')

      await act(async () => {
        fireEvent.press(previousButton)
      })

      expect(mockGoBack).not.toHaveBeenCalled()
    })

    it('should stay on the current view when focusing search input and being on the suggestions', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await act(async () => {
        fireEvent(searchInput, 'onFocus')
      })

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should reset input when user click on reset icon when being on the search suggestions view', async () => {
      useRoute.mockReturnValueOnce({
        params: { view: SearchView.Suggestions, query: 'Some text' },
      })
      renderSearchBox()

      const resetIcon = screen.getByTestId('Réinitialiser la recherche')
      await act(async () => {
        fireEvent.press(resetIcon)
      })

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: '',
          view: SearchView.Suggestions,
        })
      )
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  describe('Without autocomplete', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableAutocomplete: false } })
    })

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should stay on the current view when focusing search input and being on the %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view } })
        renderSearchBox()

        const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

        await act(async () => {
          fireEvent(searchInput, 'onFocus')
        })

        expect(navigate).not.toHaveBeenCalled()
      }
    )

    it('should reset input when user click on reset icon when being on the search suggestions view', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, query: 'Some text' } })
      renderSearchBox()

      const resetIcon = screen.getByTestId('Réinitialiser la recherche')
      await act(async () => {
        fireEvent.press(resetIcon)
      })

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: '',
          view: SearchView.Results,
        })
      )
      expect(mockClear).toHaveBeenCalledTimes(1)
    })

    it('should reset input when user click on reset icon when being on the search results view with feature flag appLocation not enabled', async () => {
      useFeatureFlagSpy.mockReturnValueOnce(false)
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, query: 'Some text' } })
      renderSearchBox()

      const resetIcon = screen.getByTestId('Réinitialiser la recherche')
      await act(async () => {
        fireEvent.press(resetIcon)
      })

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: '',
          view: SearchView.Results,
        })
      )
      expect(mockClear).toHaveBeenCalledTimes(1)
    })

    it('should reset input when user click on reset icon when being on the search results view when isDesktopViewport', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, query: 'Some text' } })
      renderSearchBox(true)

      const resetIcon = screen.getByTestId('Réinitialiser la recherche')
      await act(async () => {
        fireEvent.press(resetIcon)
      })

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: '',
          view: SearchView.Results,
        })
      )
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  it('should execute a search if input is not empty', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })
    })

    expect(navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        view: SearchView.Results,
        offerCategories: mockSearchState.offerCategories,
        priceRange: mockSearchState.priceRange,
        searchId,
      })
    )
  })

  it('should open location modal on location button click', async () => {
    jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(false)
    const mockShowModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: false,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    renderSearchBox()

    const locationButton = screen.getByTestId('Partout')

    await act(async () => {
      fireEvent.press(locationButton)
    })

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should display suggestions view when focusing search input and no search executed', async () => {
    renderSearchBox()

    const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

    await act(async () => {
      fireEvent(searchInput, 'onFocus')
    })

    expect(navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        view: SearchView.Suggestions,
        offerCategories: mockSearchState.offerCategories,
        priceRange: mockSearchState.priceRange,
      })
    )
  })

  it.each([[SearchView.Landing], [SearchView.Suggestions]])(
    'should hide the search filter button when being on the %s view',
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view, query: 'la fnac' } })
      renderSearchBox()

      await act(async () => {
        expect(screen.queryByTestId(/Voir tous les filtres/)).not.toBeOnTheScreen()
      })
    }
  )

  it.each`
    locationType                 | locationFilter                                                                          | position            | locationButtonLabel
    ${LocationMode.EVERYWHERE}   | ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${DEFAULT_POSITION} | ${'Partout'}
    ${LocationMode.EVERYWHERE}   | ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${null}             | ${'Me localiser'}
    ${LocationMode.AROUND_ME}    | ${{ locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }}                   | ${DEFAULT_POSITION} | ${'Autour de moi'}
    ${LocationMode.AROUND_PLACE} | ${{ locationType: LocationMode.AROUND_PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${Kourou.label}
    ${LocationMode.AROUND_PLACE} | ${{ locationType: LocationMode.AROUND_PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${Kourou.label}
  `(
    'should display $locationButtonLabel in location button label when location type is $locationType and position is $position',
    async ({
      locationFilter,
      position,
      locationButtonLabel,
    }: {
      locationFilter: LocationFilter
      position: Position
      locationButtonLabel: string
    }) => {
      jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(false)

      mockSearchState = { ...initialSearchState, locationFilter }
      mockPosition = position
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, locationFilter } })
      renderSearchBox()

      await act(async () => {})

      expect(screen.queryByText(locationButtonLabel)).toBeOnTheScreen()
    }
  )

  it(`should display Le Petit Rintintin 1 in location button label when a venue is selected`, async () => {
    jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(false)

    mockSearchState = {
      ...initialSearchState,
      venue,
    }
    mockPosition = null
    useRoute.mockReturnValueOnce({
      params: {
        view: SearchView.Landing,
        venue,
      },
    })
    renderSearchBox()

    await act(async () => {})

    expect(screen.getByText(venue.label)).toBeOnTheScreen()
  })

  it.each`
    locationType                 | locationFilter                                                                          | position            | locationSearchWidgetLabel
    ${LocationMode.EVERYWHERE}   | ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${DEFAULT_POSITION} | ${'Partout'}
    ${LocationMode.EVERYWHERE}   | ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${null}             | ${'Me localiser'}
    ${LocationMode.AROUND_ME}    | ${{ locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }}                   | ${DEFAULT_POSITION} | ${'Autour de moi'}
    ${LocationMode.AROUND_PLACE} | ${{ locationType: LocationMode.AROUND_PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${Kourou.label}
    ${LocationMode.AROUND_PLACE} | ${{ locationType: LocationMode.AROUND_PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${Kourou.label}
  `(
    'should display $locationSearchWidgetLabel in location search widget when location type is $locationType and position is $position',
    async ({
      locationFilter,
      position,
      locationSearchWidgetLabel,
    }: {
      locationFilter: LocationFilter
      position: Position
      locationSearchWidgetLabel: string
    }) => {
      jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(true)

      mockSearchState = { ...initialSearchState, locationFilter }
      mockPosition = position
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, locationFilter } })
      renderSearchBox()

      await act(async () => {})

      expect(screen.getByText(locationSearchWidgetLabel)).toBeOnTheScreen()
    }
  )

  it(`should not display Le Petit Rintintin 1 in location search widget when a venue is selected`, async () => {
    jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(true).mockReturnValueOnce(true)

    mockSearchState = { ...initialSearchState, venue }
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, venue } })
    renderSearchBox()

    await act(async () => {})

    expect(screen.queryByText(venue.label)).not.toBeOnTheScreen()
  })

  it('should not display locationSearchWidget when isDesktopViewport = true', async () => {
    jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(true)

    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationMode.EVERYWHERE },
    }
    mockPosition = DEFAULT_POSITION
    useRoute.mockReturnValueOnce({
      params: {
        view: SearchView.Results,
        locationFilter: { locationType: LocationMode.EVERYWHERE },
      },
    })
    renderSearchBox()

    await act(async () => {})

    expect(screen.getByText('Partout')).toBeOnTheScreen()
  })
})

describe('SearchBox component with venue previous route', () => {
  beforeEach(() => {
    jest.spyOn(navigationRef, 'getState').mockReturnValue({
      key: 'Navigator',
      index: 1,
      routeNames: ['TabNavigator'],
      routes: mockRoutesWithVenue,
      type: 'tab',
      stale: false,
    })
  })

  it('should reset location to eveywhere when current and previous views are identical and previous route is Venue', async () => {
    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Results, previousView: SearchView.Results },
    })
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      fireEvent.press(previousButton)
    })

    expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'SET_LOCATION_EVERYWHERE' })
  })

  it('should execute go back when current and previous views are identical and previous route is Venue', async () => {
    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Results, previousView: SearchView.Results },
    })
    renderSearchBox()

    const previousButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      fireEvent.press(previousButton)
    })

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})

function renderSearchBox(isDesktopViewport?: boolean) {
  const searchInputID = uuidv4()

  return render(
    <SearchBox
      searchInputID={searchInputID}
      addSearchHistory={jest.fn()}
      searchInHistory={jest.fn()}
    />,
    { theme: { isDesktopViewport: isDesktopViewport ?? false } }
  )
}
