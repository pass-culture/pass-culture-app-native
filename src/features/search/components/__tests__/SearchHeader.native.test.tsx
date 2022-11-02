import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import * as useFilterCountAPI from 'features/search/utils/useFilterCount'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render } from 'tests/utils'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))
jest.mock('libs/firebase/analytics')

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
  useInfiniteHits: () => ({
    hits: [],
  }),
}))

jest.mock('features/auth/settings')

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)

describe('SearchHeader component', () => {
  const searchInputID = uuidv4()

  it('should render SearchHeader', () => {
    expect(render(<SearchHeader searchInputID={searchInputID} />)).toMatchSnapshot()
  })
})
