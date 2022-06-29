import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnum } from 'api/gen'
import { SearchHeaderRework } from 'features/search/components/SearchHeaderRework'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
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
jest.mock('libs/analytics')

const mockSettings = {
  appEnableAutocomplete: true,
}
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
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

describe('SearchHeaderRework component', () => {
  const searchInputID = uuidv4()
  const isSetShowAutocomplete = jest.fn
  const setAutocompleteValue = jest.fn

  it('should show search box with label if no search execution and autocomplete list not visible', () => {
    const { queryByTestId } = render(
      <SearchHeaderRework
        searchInputID={searchInputID}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isShowAutocomplete={false}
        autocompleteValue=""
        isSetShowAutocomplete={isSetShowAutocomplete}
        setAutocompleteValue={setAutocompleteValue}
      />
    )

    expect(queryByTestId('searchBoxWithLabel')).toBeTruthy()
  })

  it('should not show search box without label if no search execution and autocomplete list not visible', () => {
    const { queryByTestId } = render(
      <SearchHeaderRework
        searchInputID={searchInputID}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isShowAutocomplete={false}
        autocompleteValue=""
        isSetShowAutocomplete={isSetShowAutocomplete}
        setAutocompleteValue={setAutocompleteValue}
      />
    )

    expect(queryByTestId('searchBoxWithoutLabel')).toBeFalsy()
  })

  it('should show search box without label if autocomplete list visible', () => {
    const { queryByTestId } = render(
      <SearchHeaderRework
        searchInputID={searchInputID}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isShowAutocomplete={true}
        autocompleteValue=""
        isSetShowAutocomplete={isSetShowAutocomplete}
        setAutocompleteValue={setAutocompleteValue}
      />
    )

    expect(queryByTestId('searchBoxWithoutLabel')).toBeTruthy()
  })

  it('should not show search box with label if autocomplete list visible', () => {
    const { queryByTestId } = render(
      <SearchHeaderRework
        searchInputID={searchInputID}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isShowAutocomplete={true}
        autocompleteValue=""
        isSetShowAutocomplete={isSetShowAutocomplete}
        setAutocompleteValue={setAutocompleteValue}
      />
    )

    expect(queryByTestId('searchBoxWithLabel')).toBeFalsy()
  })

  it('should show search box without label if search execution', () => {
    mockSearchState.showResults = true
    const { queryByTestId } = render(
      <SearchHeaderRework
        searchInputID={searchInputID}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isShowAutocomplete={true}
        autocompleteValue=""
        isSetShowAutocomplete={isSetShowAutocomplete}
        setAutocompleteValue={setAutocompleteValue}
      />
    )

    expect(queryByTestId('searchBoxWithoutLabel')).toBeTruthy()
  })

  it('should not show search box with label if search execution', () => {
    mockSearchState.showResults = true
    const { queryByTestId } = render(
      <SearchHeaderRework
        searchInputID={searchInputID}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isShowAutocomplete={true}
        autocompleteValue=""
        isSetShowAutocomplete={isSetShowAutocomplete}
        setAutocompleteValue={setAutocompleteValue}
      />
    )

    expect(queryByTestId('searchBoxWithLabel')).toBeFalsy()
  })
})
