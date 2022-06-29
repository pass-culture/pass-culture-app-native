import React from 'react'

import { SearchGroupNameEnum } from 'api/gen'
import { SearchDetails } from 'features/search/components/SearchDetails'
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

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: jest.fn(),
}))

jest.mock('react-instantsearch-hooks', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
}))

describe('SearchDetails component', () => {
  const isSetShowAutocomplete = jest.fn
  it('should render SearchDetails', () => {
    expect(
      render(
        <SearchDetails
          isShowAutocomplete={true}
          appEnableAutocomplete={mockSettings.appEnableAutocomplete}
          isSetShowAutocomplete={isSetShowAutocomplete}
        />
      )
    ).toMatchSnapshot()
  })

  it('should show results if search executed and autocomplete list display flag is false', () => {
    mockSearchState.showResults = true
    const { queryByTestId } = render(
      <SearchDetails
        isShowAutocomplete={false}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isSetShowAutocomplete={isSetShowAutocomplete}
      />
    )
    expect(queryByTestId('searchResults')).toBeTruthy()
  })

  it('should not show results if search executed and autocomplete list display flag is true', () => {
    mockSearchState.showResults = true
    const { queryByTestId } = render(
      <SearchDetails
        isShowAutocomplete={true}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isSetShowAutocomplete={isSetShowAutocomplete}
      />
    )
    expect(queryByTestId('searchResults')).toBeFalsy()
  })

  it('should show autocomplete list if search not executed and autocomplete list display flag is true', () => {
    mockSearchState.showResults = false
    const { queryByTestId } = render(
      <SearchDetails
        isShowAutocomplete={true}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isSetShowAutocomplete={isSetShowAutocomplete}
      />
    )
    expect(queryByTestId('recentsSearchesAndSuggestions')).toBeTruthy()
  })

  it('should show autocomplete list if search executed and autocomplete list display flag is true', () => {
    mockSearchState.showResults = true
    const { queryByTestId } = render(
      <SearchDetails
        isShowAutocomplete={true}
        appEnableAutocomplete={mockSettings.appEnableAutocomplete}
        isSetShowAutocomplete={isSetShowAutocomplete}
      />
    )
    expect(queryByTestId('recentsSearchesAndSuggestions')).toBeTruthy()
  })
})
