import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render, fireEvent } from 'tests/utils'

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
jest.mock('libs/analytics')
jest.mock('features/auth/settings')

jest.mock('features/home/api', () => ({
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

describe('SearchDetails component', () => {
  it('should redirect to search home on arrow left click', async () => {
    const { getByTestId } = render(<SearchDetails />)
    const previousBtn = getByTestId('previousBtn')

    await fireEvent.press(previousBtn)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('TabNavigator', { params: undefined, screen: 'Search' })
  })

  it('should log search query on submit', async () => {
    const { getByTestId } = render(<SearchDetails />)
    const searchInput = getByTestId('searchInput')

    await fireEvent(searchInput, 'onChangeText', 'jazzaza')
    await fireEvent(searchInput, 'onSubmitEditing')

    expect(analytics.logSearchQuery).toBeCalledWith('jazzaza')
  })

  it('should redirect on search on submit', async () => {
    const { getByTestId } = render(<SearchDetails />)
    const searchInput = getByTestId('searchInput')

    await fireEvent(searchInput, 'onChangeText', 'jazzaza')
    await fireEvent(searchInput, 'onSubmitEditing')

    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        query: 'jazzaza',
        showResults: true,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
      })
    )
  })

  it('should show the text type by the user', async () => {
    const { getByTestId } = render(<SearchDetails />)

    const searchInput = getByTestId('searchInput')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    expect(searchInput.props.value).toBe('Some text')
  })

  it('should reset input when user click on reset icon', async () => {
    const { getByTestId } = render(<SearchDetails />)

    const searchInput = getByTestId('searchInput')
    await fireEvent(searchInput, 'onChangeText', 'Some text')

    const resetIcon = getByTestId('resetSearchInput')
    await fireEvent.press(resetIcon)

    expect(searchInput.props.value).toBe('')
  })
})
