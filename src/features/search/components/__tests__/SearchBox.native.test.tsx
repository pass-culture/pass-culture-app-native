import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
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

describe('SearchBox component', () => {
  const searchInputID = uuidv4()

  it('should render SearchBox', () => {
    expect(render(<SearchBox searchInputID={searchInputID} />)).toMatchSnapshot()
  })

  it('should call logSearchQuery on submit', () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(analytics.logSearchQuery).toBeCalledWith('jazzaza')
    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        showResults: true,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
      })
    )
  })

  it('should not show previous if no search executed and no focus on input', () => {
    const { queryByTestId } = render(<SearchBox searchInputID={searchInputID} />)
    const previousButton = queryByTestId('previousButton')

    expect(previousButton).toBeFalsy()
  })

  it('should show previous button if search executed', () => {
    mockSearchState.showResults = true
    const { getByTestId } = render(<SearchBox searchInputID={searchInputID} />)
    const previousButton = getByTestId('previousButton')

    expect(previousButton).toBeTruthy()
  })

  it('should show previous button if focus on input', () => {
    const { getByTestId } = render(<SearchBox searchInputID={searchInputID} isFocus={true} />)
    const previousButton = getByTestId('previousButton')

    expect(previousButton).toBeTruthy()
  })

  it('should show the text type by the user', async () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should reset input when user click on reset icon', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <SearchBox searchInputID={searchInputID} />
    )

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    const resetIcon = getByTestId('resetSearchInput')
    await fireEvent.press(resetIcon)

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...mockStagedSearchState,
        query: '',
      })
    )
  })

  it('should reset input when user click on previous button', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <SearchBox searchInputID={searchInputID} />
    )
    const previousButton = getByTestId('previousButton')

    const searchInput = getByPlaceholderText('Offre, artiste...')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

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
        showResults: false,
        locationFilter: mockStagedSearchState.locationFilter,
      })
    )
  })

  it('should not execute a search if input is empty', () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: '' } })

    expect(navigate).not.toBeCalled()
  })

  it('should execute a search if input is not empty', () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        ...initialSearchState,
        query: 'jazzaza',
        showResults: true,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
      })
    )
  })

  it('should redirect on location page on location button click', async () => {
    const { getByTestId } = render(
      <SearchBox searchInputID={searchInputID} showLocationButton={true} />
    )
    const locationButton = getByTestId('locationButton')
    await fireEvent.press(locationButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'LocationFilter')
  })
})
