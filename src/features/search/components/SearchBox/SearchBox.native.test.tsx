import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigationRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { LocationFilter, SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/geolocation'
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

jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockPosition,
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

  const searchInputID = uuidv4()

  it('should render SearchBox', async () => {
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should call navigate on submit', async () => {
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const searchInput = screen.getByPlaceholderText('Offre, artiste, point de vente...')

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
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const previousButton = screen.queryByTestId('Revenir en arrière')

    await act(async () => {
      expect(previousButton).not.toBeOnTheScreen()
    })
  })

  it('should show back button when being on the search results view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results } })
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const previousButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      expect(previousButton).toBeOnTheScreen()
    })
  })

  it('should show back button when being on the suggestions view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const previousButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      expect(previousButton).toBeOnTheScreen()
    })
  })

  it('should show the text typed by the user', async () => {
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )

    const searchInput = screen.getByPlaceholderText('Offre, artiste, point de vente...')
    await act(async () => {
      fireEvent(searchInput, 'onChangeText', 'Some text')
    })

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should not execute a search if input is empty', async () => {
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const searchInput = screen.getByPlaceholderText('Offre, artiste, point de vente...')

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

      render(
        <SearchBox
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )

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
        render(
          <SearchBox
            searchInputID={searchInputID}
            addSearchHistory={jest.fn()}
            searchInHistory={jest.fn()}
          />
        )
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
      render(
        <SearchBox
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )
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
      render(
        <SearchBox
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )
      const previousButton = screen.getByTestId('Revenir en arrière')

      await act(async () => {
        fireEvent.press(previousButton)
      })

      expect(mockGoBack).not.toHaveBeenCalled()
    })

    it('should stay on the current view when focusing search input and being on the suggestions', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
      render(
        <SearchBox
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )
      const searchInput = screen.getByPlaceholderText('Offre, artiste, point de vente...')

      await act(async () => {
        fireEvent(searchInput, 'onFocus')
      })

      expect(navigate).not.toHaveBeenCalled()
    })

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should reset input when user click on reset icon when being on the search %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view, query: 'Some text' } })
        render(
          <SearchBox
            searchInputID={searchInputID}
            addSearchHistory={jest.fn()}
            searchInHistory={jest.fn()}
          />
        )

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
      }
    )
  })

  describe('Without autocomplete', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableAutocomplete: false } })
    })

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should stay on the current view when focusing search input and being on the %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view } })
        render(
          <SearchBox
            searchInputID={searchInputID}
            addSearchHistory={jest.fn()}
            searchInHistory={jest.fn()}
          />
        )
        const searchInput = screen.getByPlaceholderText('Offre, artiste, point de vente...')

        await act(async () => {
          fireEvent(searchInput, 'onFocus')
        })

        expect(navigate).not.toHaveBeenCalled()
      }
    )

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should reset input when user click on reset icon when being on the search %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view, query: 'Some text' } })
        render(
          <SearchBox
            searchInputID={searchInputID}
            addSearchHistory={jest.fn()}
            searchInHistory={jest.fn()}
          />
        )

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
      }
    )
  })

  it('should execute a search if input is not empty', async () => {
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const searchInput = screen.getByPlaceholderText('Offre, artiste, point de vente...')

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
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )

    const locationButton = screen.getByTestId('Partout')

    await act(async () => {
      fireEvent.press(locationButton)
    })

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should display suggestions view when focusing search input and no search executed', async () => {
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const searchInput = screen.getByPlaceholderText('Offre, artiste, point de vente...')

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
      render(
        <SearchBox
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )

      await act(async () => {
        expect(screen.queryByTestId(/Voir tous les filtres/)).not.toBeOnTheScreen()
      })
    }
  )

  it.each`
    locationType               | locationFilter                                                                   | position            | locationButtonLabel
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${DEFAULT_POSITION} | ${'Partout'}
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${null}             | ${'Me localiser'}
    ${LocationType.AROUND_ME}  | ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }}            | ${DEFAULT_POSITION} | ${'Autour de moi'}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${Kourou.label}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${Kourou.label}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${DEFAULT_POSITION} | ${venue.label}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${null}             | ${venue.label}
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
      render(
        <SearchBox
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )
      await act(async () => {})

      expect(screen.queryByText(locationButtonLabel)).toBeOnTheScreen()
    }
  )

  it.each`
    locationType               | locationFilter                                                                   | position            | locationSearchWidgetLabel
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${DEFAULT_POSITION} | ${'Partout'}
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${null}             | ${'Me localiser'}
    ${LocationType.AROUND_ME}  | ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }}            | ${DEFAULT_POSITION} | ${'Autour de moi'}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${Kourou.label}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${Kourou.label}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${DEFAULT_POSITION} | ${venue.label}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${null}             | ${venue.label}
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
      render(
        <SearchBox
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )
      await act(async () => {})

      expect(screen.getByText(locationSearchWidgetLabel)).toBeOnTheScreen()
    }
  )

  it('should not display locationSearchWidget when isDesktopViewport = true', async () => {
    jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValueOnce(true)

    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.EVERYWHERE },
    }
    mockPosition = DEFAULT_POSITION
    useRoute.mockReturnValueOnce({
      params: {
        view: SearchView.Results,
        locationFilter: { locationType: LocationType.EVERYWHERE },
      },
    })
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />,
      { theme: { isDesktopViewport: true } }
    )
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

  const searchInputID = uuidv4()

  it('should reset location to eveywhere when current and previous views are identical and previous route is Venue', async () => {
    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Results, previousView: SearchView.Results },
    })
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
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
    render(
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    const previousButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      fireEvent.press(previousButton)
    })

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})
