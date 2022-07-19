import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState, SearchView } from 'features/search/types'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render } from 'tests/utils'

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

describe('SearchHeader component', () => {
  const searchInputID = uuidv4()

  it('should render SearchHeader', () => {
    expect(render(<SearchHeader searchInputID={searchInputID} />)).toMatchSnapshot()
  })

  it('should show search box with label if no search execution and focus is not on input', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { queryByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    expect(queryByTestId('searchBoxWithLabel')).toBeTruthy()
  })

  it('should not show search box without label if no search execution and focus is not on input', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { queryByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    expect(queryByTestId('searchBoxWithoutLabel')).toBeNull()
  })

  it('should show search box without label if focus is on input', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, query: 'la fnac' } })
    const { queryByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    expect(queryByTestId('searchBoxWithoutLabel')).toBeTruthy()
  })

  it('should not show search box with label if focus is on input', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, query: 'la fnac' } })
    const { queryByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    expect(queryByTestId('searchBoxWithLabel')).toBeNull()
  })

  it('should show search box without label if search execution', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, query: 'la fnac' } })
    const { queryByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    expect(queryByTestId('searchBoxWithoutLabel')).toBeTruthy()
  })

  it('should not show search box with label if search execution', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results, query: 'la fnac' } })
    const { queryByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    expect(queryByTestId('searchBoxWithLabel')).toBeNull()
  })
})
