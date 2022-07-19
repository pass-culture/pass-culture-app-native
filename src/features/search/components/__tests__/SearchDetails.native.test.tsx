import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { SearchDetails } from 'features/search/components/SearchDetails'
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
const mockSettings = {
  appEnableAutocomplete: true,
}
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

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

jest.mock('react-instantsearch-hooks', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [],
  }),
}))

describe('SearchDetails component', () => {
  it('should render SearchDetails', () => {
    expect(
      render(<SearchDetails appEnableAutocomplete={mockSettings.appEnableAutocomplete} />)
    ).toMatchSnapshot()
  })

  it('should show results if search executed and autocomplete list display flag is false', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Results } })
    const { queryByTestId } = render(
      <SearchDetails appEnableAutocomplete={mockSettings.appEnableAutocomplete} />
    )
    expect(queryByTestId('searchResults')).toBeTruthy()
  })

  it('should not show results if search executed and autocomplete list display flag is true', () => {
    useRoute.mockReturnValueOnce({ params: { showResults: true } })
    const { queryByTestId } = render(
      <SearchDetails appEnableAutocomplete={mockSettings.appEnableAutocomplete} />
    )
    expect(queryByTestId('searchResults')).toBeFalsy()
  })

  it('should show autocomplete list if search not executed and autocomplete list display flag is true', () => {
    useRoute.mockReturnValueOnce({ params: { showResults: false } })
    const { queryByTestId } = render(
      <SearchDetails appEnableAutocomplete={mockSettings.appEnableAutocomplete} />
    )
    expect(queryByTestId('autocompleteList')).toBeTruthy()
  })

  it('should show autocomplete list if search executed and autocomplete list display flag is true', () => {
    useRoute.mockReturnValueOnce({ params: { showResults: true } })
    const { queryByTestId } = render(
      <SearchDetails appEnableAutocomplete={mockSettings.appEnableAutocomplete} />
    )
    expect(queryByTestId('autocompleteList')).toBeTruthy()
  })
})
