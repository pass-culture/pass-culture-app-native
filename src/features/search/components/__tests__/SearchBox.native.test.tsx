import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { LocationFilter, SearchState, SearchView } from 'features/search/types'
import * as useFilterCountAPI from 'features/search/utils/useFilterCount'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render, act, superFlushWithAct } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

import { SearchBox } from '../SearchBox'

let mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

jest.mock('libs/firebase/analytics')

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { isBeneficiary: true } })),
}))

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/pages/useSearchResults', () => ({
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
jest.mock('react-instantsearch-hooks', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
    clear: mockClear,
  }),
}))

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue: SuggestedVenue = mockedSuggestedVenues[0]

const searchId = uuidv4()

describe('SearchBox component', () => {
  const searchInputID = uuidv4()

  it('should render SearchBox', async () => {
    jest.useFakeTimers()
    const renderAPI = render(<SearchBox searchInputID={searchInputID} />)
    await superFlushWithAct()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call logSearchQuery on submit', async () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })
    })

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        view: SearchView.Results,
        offerCategories: mockSearchState.offerCategories,
        locationFilter: mockSearchState.locationFilter,
        priceRange: mockSearchState.priceRange,
        searchId,
      })
    )
    expect(analytics.logSearchQuery).toBeCalledWith(
      'jazzaza',
      ['Localisation', 'Catégories'],
      searchId
    )
  })

  it('should not show back button when being on the search landing view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { queryByTestId } = render(<SearchBox searchInputID={searchInputID} />)
    const previousButton = queryByTestId('backButton')

    await act(async () => {
      expect(previousButton).toBeFalsy()
    })
  })

  it('should show back button when being on the search results view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results } })
    const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)
    const previousButton = getByTestId('backButton')

    await act(async () => {
      expect(previousButton).toBeTruthy()
    })
  })

  it('should show back button when being on the suggestions view', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
    const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)
    const previousButton = getByTestId('backButton')

    await act(async () => {
      expect(previousButton).toBeTruthy()
    })
  })

  it('should show the text typed by the user', async () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await act(async () => {
      fireEvent(searchInput, 'onChangeText', 'Some text')
    })

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should not execute a search if input is empty', async () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: '' } })
    })

    expect(navigate).not.toBeCalled()
  })

  describe('With autocomplete', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableAutocomplete: true } })
    })

    it('should redirect on results view when being on the suggestions view and press back button and previous view is results view', async () => {
      useRoute.mockReturnValueOnce({
        params: { view: SearchView.Suggestions, previousView: SearchView.Results },
      })

      const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)

      const previousButton = getByTestId('backButton')

      await act(async () => {
        fireEvent.press(previousButton)
      })

      expect(navigate).toBeCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          view: SearchView.Results,
          previousView: SearchView.Results,
          offerCategories: mockSearchState.offerCategories,
          locationFilter: mockSearchState.locationFilter,
          priceRange: mockSearchState.priceRange,
        })
      )
    })

    it.each([[undefined], [SearchView.Landing]])(
      'should redirect on landing view when being on the suggestions view and press back button and previous view is %s view',
      async (previousView) => {
        useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, previousView } })
        const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)
        const previousButton = getByTestId('backButton')

        await act(async () => {
          fireEvent.press(previousButton)
        })

        expect(mockDispatch).toBeCalledWith({
          type: 'SET_STATE_FROM_DEFAULT',
          payload: {
            locationFilter: mockSearchState.locationFilter,
          },
        })
        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: '',
            view: SearchView.Landing,
            locationFilter: mockSearchState.locationFilter,
          })
        )
      }
    )

    it('should stay on the current view when focusing search input and being on the suggestions', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
      const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
      const searchInput = getByPlaceholderText('Offre, artiste...')

      await act(async () => {
        fireEvent(searchInput, 'onFocus')
      })

      expect(navigate).not.toBeCalled()
    })

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should reset input when user click on reset icon when being on the search %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view, query: 'Some text' } })
        const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)

        const resetIcon = getByTestId('resetSearchInput')
        await act(async () => {
          fireEvent.press(resetIcon)
        })

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...mockSearchState,
            query: '',
            view: SearchView.Suggestions,
          })
        )
        expect(mockClear).toHaveBeenCalled()
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
        const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
        const searchInput = getByPlaceholderText('Offre, artiste...')

        await act(async () => {
          fireEvent(searchInput, 'onFocus')
        })

        expect(navigate).not.toBeCalled()
      }
    )

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should reset input when user click on reset icon when being on the search %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view, query: 'Some text' } })
        const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)

        const resetIcon = getByTestId('resetSearchInput')
        await act(async () => {
          fireEvent.press(resetIcon)
        })

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...mockSearchState,
            query: '',
            view: SearchView.Results,
          })
        )
        expect(mockClear).toHaveBeenCalled()
      }
    )
  })

  it('should execute a search if input is not empty', async () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    await act(async () => {
      fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })
    })

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        view: SearchView.Results,
        offerCategories: mockSearchState.offerCategories,
        locationFilter: mockSearchState.locationFilter,
        priceRange: mockSearchState.priceRange,
        searchId,
      })
    )
  })

  it('should open location modal on location button click', async () => {
    const mockShowModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: false,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)
    const locationButton = getByTestId('locationButton')

    await act(async () => {
      fireEvent.press(locationButton)
    })

    expect(mockShowModal).toBeCalled()
  })

  it('should display suggestions view when focusing search input and no search executed', async () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    await act(async () => {
      fireEvent(searchInput, 'onFocus')
    })

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        view: SearchView.Suggestions,
        offerCategories: mockSearchState.offerCategories,
        locationFilter: mockSearchState.locationFilter,
        priceRange: mockSearchState.priceRange,
      })
    )
  })

  it('should display the search filter button when showing results', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, query: 'la fnac' } })
    const { queryByTestId } = render(<SearchBox searchInputID={searchInputID} />)

    await act(async () => {
      expect(queryByTestId('searchFilterButton')).toBeTruthy()
    })
  })

  it.each([[SearchView.Landing], [SearchView.Suggestions]])(
    'should hide the search filter button when being on the %s view',
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view, query: 'la fnac' } })
      const { queryByTestId } = render(<SearchBox searchInputID={searchInputID} />)

      await act(async () => {
        expect(queryByTestId('searchFilterButton')).toBeNull()
      })
    }
  )

  it('should display filter button with the number of active filters', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results } })

    const renderAPI = render(<SearchBox searchInputID={searchInputID} />)
    let filterButton
    await act(async () => {
      filterButton = renderAPI.getByTestId('searchFilterBadge')
    })

    expect(filterButton).toHaveTextContent('3')
  })

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
      position: GeoCoordinates | null
      locationButtonLabel: string
    }) => {
      mockSearchState = { ...initialSearchState, locationFilter }
      mockPosition = position
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, locationFilter } })
      const { queryByText } = render(<SearchBox searchInputID={searchInputID} />)

      superFlushWithAct()

      expect(queryByText(locationButtonLabel)).toBeTruthy()
    }
  )
})
