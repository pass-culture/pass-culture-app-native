import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState, SearchView } from 'features/search/types'
import * as useFilterCountAPI from 'features/search/utils/useFilterCount'
import { analytics } from 'libs/firebase/analytics'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render } from 'tests/utils'

import { SearchBox } from '../SearchBox'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState = initialSearchState
const mockStagedSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnum.CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useStagedSearch: () => ({ searchState: mockStagedSearchState, dispatch: mockStagedDispatch }),
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

jest.mock('react-instantsearch-hooks', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
    clear: jest.fn,
  }),
}))

describe('SearchBox component', () => {
  const searchInputID = uuidv4()

  it('should render SearchBox', () => {
    expect(
      render(<SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />)
    ).toMatchSnapshot()
  })

  it('should call logSearchQuery on submit', () => {
    const { getByPlaceholderText } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(analytics.logSearchQuery).toBeCalledWith('jazzaza')
    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        view: SearchView.Results,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
      })
    )
  })

  it('should not show previous button when being on the search landing view', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { queryByTestId } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const previousButton = queryByTestId('previousButton')

    expect(previousButton).toBeFalsy()
  })

  it('should show previous button when being on the search results view', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results } })
    const { getByTestId } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const previousButton = getByTestId('previousButton')

    expect(previousButton).toBeTruthy()
  })

  it('should show previous button when being on the suggestions view', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
    const { getByTestId } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const previousButton = getByTestId('previousButton')

    expect(previousButton).toBeTruthy()
  })

  it('should show the text typed by the user', async () => {
    const { getByPlaceholderText } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should not execute a search if input is empty', () => {
    const { getByPlaceholderText } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: '' } })

    expect(navigate).not.toBeCalled()
  })

  describe('With autocomplete', () => {
    it('should redirect on results view when being on the suggestions view and query is defined', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, query: 'test' } })
      const { getByTestId } = render(
        <SearchBox searchInputID={searchInputID} appEnableAutocomplete={true} />
      )

      const previousButton = getByTestId('previousButton')

      await fireEvent.press(previousButton)

      expect(navigate).toBeCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: 'test',
          view: SearchView.Results,
          offerCategories: mockStagedSearchState.offerCategories,
          locationFilter: mockStagedSearchState.locationFilter,
          priceRange: mockStagedSearchState.priceRange,
        })
      )
    })

    it('should reset input when user click on previous button being on the suggestions view and query is not defined', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, query: '' } })
      const { getByTestId } = render(
        <SearchBox searchInputID={searchInputID} appEnableAutocomplete={true} />
      )
      const previousButton = getByTestId('previousButton')

      await fireEvent.press(previousButton)

      expect(mockStagedDispatch).toBeCalledWith({
        type: 'SET_STATE',
        payload: {
          locationFilter: mockStagedSearchState.locationFilter,
        },
      })
      expect(navigate).toBeCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: '',
          view: SearchView.Landing,
          locationFilter: mockStagedSearchState.locationFilter,
        })
      )
    })

    it('should stay on the current view when focusing search input and being on the suggestions', async () => {
      useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
      const { getByPlaceholderText } = render(
        <SearchBox searchInputID={searchInputID} appEnableAutocomplete={true} />
      )
      const searchInput = getByPlaceholderText('Offre, artiste...')

      await fireEvent(searchInput, 'onFocus')

      expect(navigate).not.toBeCalled()
    })

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should reset input when user click on reset icon when being on the search %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view, query: 'Some text' } })
        const { getByTestId } = render(
          <SearchBox searchInputID={searchInputID} appEnableAutocomplete={true} />
        )

        const resetIcon = getByTestId('resetSearchInput')
        await fireEvent.press(resetIcon)

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...mockStagedSearchState,
            query: '',
            view: SearchView.Suggestions,
          })
        )
      }
    )
  })

  describe('Without autocomplete', () => {
    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should stay on the current view when focusing search input and being on the %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view } })
        const { getByPlaceholderText } = render(
          <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
        )
        const searchInput = getByPlaceholderText('Offre, artiste...')

        await fireEvent(searchInput, 'onFocus')

        expect(navigate).not.toBeCalled()
      }
    )

    it.each([[SearchView.Suggestions], [SearchView.Results]])(
      'should reset input when user click on reset icon when being on the search %s view',
      async (view) => {
        useRoute.mockReturnValueOnce({ params: { view, query: 'Some text' } })
        const { getByTestId } = render(
          <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
        )

        const resetIcon = getByTestId('resetSearchInput')
        await fireEvent.press(resetIcon)

        expect(navigate).toBeCalledWith(
          ...getTabNavConfig('Search', {
            ...mockStagedSearchState,
            query: '',
            view: SearchView.Results,
          })
        )
      }
    )
  })

  it('should execute a search if input is not empty', () => {
    const { getByPlaceholderText } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        view: SearchView.Results,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
      })
    )
  })

  it('should redirect on location page on location button click', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { getByTestId } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const locationButton = getByTestId('locationButton')
    await fireEvent.press(locationButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'LocationFilter')
  })

  it('should display suggestions view when focusing search input and no search executed', async () => {
    const { getByPlaceholderText } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )
    const searchInput = getByPlaceholderText('Offre, artiste...')

    await fireEvent(searchInput, 'onFocus')

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        view: SearchView.Suggestions,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
      })
    )
  })

  it('should display the search filter button when showing results', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, query: 'la fnac' } })
    const { queryByTestId } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )

    expect(queryByTestId('searchFilterButton')).toBeTruthy()
  })

  it.each([[SearchView.Landing], [SearchView.Suggestions]])(
    'should hide the search filter button when being on the %s view',
    (view) => {
      useRoute.mockReturnValueOnce({ params: { view, query: 'la fnac' } })
      const { queryByTestId } = render(
        <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
      )

      expect(queryByTestId('searchFilterButton')).toBeNull()
    }
  )

  it('should display filter button with the number of active filters', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results } })
    const { getByTestId } = render(
      <SearchBox searchInputID={searchInputID} appEnableAutocomplete={false} />
    )

    const filterButton = getByTestId('searchFilterBadge')

    expect(filterButton).toHaveTextContent('3')
  })
})
