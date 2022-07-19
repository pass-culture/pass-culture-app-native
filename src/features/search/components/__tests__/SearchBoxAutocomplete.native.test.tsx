import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, push } from '__mocks__/@react-navigation/native'
import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchBoxAutocomplete } from 'features/search/components/SearchBoxAutocomplete'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render } from 'tests/utils'

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

jest.mock('features/auth/settings')

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
jest.mock('react-instantsearch-hooks', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
}))

describe('SearchBoxAutocomplete component', () => {
  const searchInputID = uuidv4()

  it('should call logSearchQuery on submit', () => {
    const { getByPlaceholderText } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(analytics.logSearchQuery).toBeCalledWith('jazzaza')
    expect(push).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        showResults: false,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
        view: SearchView.Results,
      })
    )
  })

  it('should not show previous button if no search executed and autocomplete list not visible', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { queryByTestId } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)
    const previousButton = queryByTestId('previousButton')

    expect(previousButton).toBeFalsy()
  })

  it('should show previous button if search executed', () => {
    mockSearchState.showResults = true
    const { getByTestId } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)
    const previousButton = getByTestId('previousButton')

    expect(previousButton).toBeTruthy()
  })

  it('should show previous button if autocomplete list visible', () => {
    const { getByTestId } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)
    const previousButton = getByTestId('previousButton')

    expect(previousButton).toBeTruthy()
  })

  it('should show the text type by the user', async () => {
    const { getByPlaceholderText } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should reset input when user click on reset icon', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <SearchBoxAutocomplete searchInputID={searchInputID} />
    )

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    const resetIcon = getByTestId('resetSearchInput')
    await fireEvent.press(resetIcon)

    expect(searchInput.props.value).toBe('')
  })

  it('should reset input when user click on previous button', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <SearchBoxAutocomplete searchInputID={searchInputID} />
    )
    const previousButton = getByTestId('previousButton')

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    await fireEvent.press(previousButton)

    expect(searchInput.props.value).toBe('')
  })

  it('should not execute a search if input is empty', () => {
    const { getByPlaceholderText } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: '' } })

    expect(navigate).not.toBeCalled()
  })

  it('should execute a search if input is not empty', () => {
    const { getByPlaceholderText } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(push).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        showResults: false,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
        view: SearchView.Results,
      })
    )
  })

  it('should redirect on location page on location button click', async () => {
    const { getByTestId } = render(
      <SearchBoxAutocomplete searchInputID={searchInputID} showLocationButton={true} />
    )
    const locationButton = getByTestId('locationButton')
    await fireEvent.press(locationButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'LocationFilter')
  })

  it('should not reset input when user click on previous button if autocomplete list is open', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions } })
    const { getByTestId } = render(<SearchBoxAutocomplete searchInputID={searchInputID} />)
    const previousButton = getByTestId('previousButton')

    await fireEvent.press(previousButton)

    expect(push).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        showResults: false,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
        view: SearchView.Results,
      })
    )
  })
})
