import React from 'react'

import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { usePreviousRouteName } from 'features/navigation/helpers/usePreviousRouteName'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { OffersList } from 'features/search/pages/SearchResults/v2/components/SearchLists/OffersList'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { FetchSearchResultsArgs, SearchState, SearchView } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('queries/subcategories/useSubcategoriesQuery')
jest.mock('features/navigation/helpers/usePreviousRouteName')
jest.mock('@shopify/flash-list', () => ({
  ...jest.requireActual('@shopify/flash-list'),
  FlashList: jest.requireActual('react-native').FlatList,
}))

const mockSearchState: SearchState = {
  ...initialSearchState,
  query: 'cinéma',
  searchId: 'test-search-id',
}
const mockUseSearch = jest.mocked(useSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(),
}))

const mockUsePreviousRouteName = jest.mocked(usePreviousRouteName)

const mockUseAccessibilityFiltersContext = jest.mocked(useAccessibilityFiltersContext)
jest.mock('features/accessibility/context/AccessibilityFiltersWrapper', () => ({
  ...jest.requireActual('features/accessibility/context/AccessibilityFiltersWrapper'),
  useAccessibilityFiltersContext: jest.fn(),
}))

const defaultOffersResponse = {
  offers: mockedAlgoliaResponse.hits,
  nbHits: mockedAlgoliaResponse.hits.length,
  duplicatedOffers: [],
  offerVenues: [],
  lastPage: undefined,
  userData: null,
}

const defaultQueryResult = {
  data: defaultOffersResponse,
  hasNextPage: false,
  fetchNextPage: jest.fn(),
  refetch: jest.fn(),
  isRefetching: false,
  isSuccess: true,
  isFetching: false,
  isLoading: false,
}

const mockUseSearchOffersQuery = jest.mocked(useSearchOffersQuery)
jest.mock('features/search/queries/useSearchOffersQuery/useSearchOffersQuery', () => ({
  useSearchOffersQuery: jest.fn(),
}))

const defaultSearchFilters: FetchSearchResultsArgs = {
  parameters: { page: 0, ...mockSearchState },
  buildLocationParameterParams: {
    userLocation: null,
    selectedLocationMode: LocationMode.EVERYWHERE,
    aroundMeRadius: 'all',
    aroundPlaceRadius: 'all',
    geolocPosition: undefined,
  },
  isUserUnderage: false,
  disabilitiesProperties: defaultDisabilitiesProperties,
}

describe('<OffersList />', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockUseSearch.mockReturnValue({
      searchState: mockSearchState,
      dispatch: jest.fn(),
      resetSearch: jest.fn(),
      isFocusOnSuggestions: false,
      showSuggestions: jest.fn(),
      hideSuggestions: jest.fn(),
    })
    mockUsePreviousRouteName.mockReturnValue(SearchView.Landing)
    mockUseAccessibilityFiltersContext.mockReturnValue({
      disabilities: defaultDisabilitiesProperties,
      setDisabilities: jest.fn(),
    })
    mockUseSearchOffersQuery.mockReturnValue(
      defaultQueryResult as unknown as ReturnType<typeof useSearchOffersQuery>
    )
  })

  describe('Analytics', () => {
    it('should log PerformSearch when query succeeds and is not fetching', () => {
      render(reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />))

      expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
      expect(analytics.logPerformSearch).toHaveBeenCalledWith(
        mockSearchState,
        defaultDisabilitiesProperties,
        defaultOffersResponse.nbHits,
        SearchView.Results
      )
      expect(analytics.logNoSearchResult).not.toHaveBeenCalled()
    })

    it('should log PerformSearch with ThematicSearch view when previous route is ThematicSearch', () => {
      mockUsePreviousRouteName.mockReturnValueOnce(SearchView.Thematic)

      render(reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />))

      expect(analytics.logPerformSearch).toHaveBeenCalledWith(
        mockSearchState,
        defaultDisabilitiesProperties,
        defaultOffersResponse.nbHits,
        SearchView.Thematic
      )
    })

    it('should not log PerformSearch when query is still fetching', () => {
      mockUseSearchOffersQuery.mockReturnValueOnce({
        ...defaultQueryResult,
        isFetching: true,
      } as unknown as ReturnType<typeof useSearchOffersQuery>)

      render(reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />))

      expect(analytics.logPerformSearch).not.toHaveBeenCalled()
    })

    it('should not log PerformSearch when query is not in success state', () => {
      mockUseSearchOffersQuery.mockReturnValueOnce({
        ...defaultQueryResult,
        isSuccess: false,
      } as unknown as ReturnType<typeof useSearchOffersQuery>)

      render(reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />))

      expect(analytics.logPerformSearch).not.toHaveBeenCalled()
    })

    it('should log PerformSearch only once for the same search key when navigating to SearchMap and back or changing page', () => {
      const { rerender } = render(
        reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />)
      )

      expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)

      mockUsePreviousRouteName.mockReturnValueOnce(SearchView.Results)

      rerender(reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />))

      mockUsePreviousRouteName.mockReturnValueOnce(SearchView.Landing)

      rerender(
        reactQueryProviderHOC(
          <OffersList
            searchFilters={{
              ...defaultSearchFilters,
              parameters: { ...defaultSearchFilters.parameters, page: 1 },
            }}
          />
        )
      )

      expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
    })

    it('should log PerformSearch twice when there is an effective search filters change', () => {
      const { rerender } = render(
        reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />)
      )

      expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)

      const updatedSearchState: SearchState = { ...mockSearchState, query: 'théâtre' }
      mockUseSearch.mockReturnValueOnce({
        searchState: updatedSearchState,
        dispatch: jest.fn(),
        resetSearch: jest.fn(),
        isFocusOnSuggestions: false,
        showSuggestions: jest.fn(),
        hideSuggestions: jest.fn(),
      })

      rerender(
        reactQueryProviderHOC(
          <OffersList
            searchFilters={{
              ...defaultSearchFilters,
              parameters: { page: 0, ...updatedSearchState },
            }}
          />
        )
      )

      expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
        2,
        updatedSearchState,
        defaultDisabilitiesProperties,
        defaultOffersResponse.nbHits,
        SearchView.Results
      )
    })

    it('should also log NoSearchResult when nbHits is 0', () => {
      mockUseSearchOffersQuery.mockReturnValueOnce({
        ...defaultQueryResult,
        data: { ...defaultOffersResponse, offers: [], nbHits: 0 },
      } as unknown as ReturnType<typeof useSearchOffersQuery>)

      render(reactQueryProviderHOC(<OffersList searchFilters={defaultSearchFilters} />))

      expect(analytics.logPerformSearch).toHaveBeenCalledWith(
        mockSearchState,
        defaultDisabilitiesProperties,
        0,
        SearchView.Results
      )
      expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
      expect(analytics.logNoSearchResult).toHaveBeenCalledWith(
        mockSearchState.query,
        mockSearchState.searchId
      )
    })
  })
})
