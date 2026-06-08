// eslint-disable-next-line no-restricted-imports
import { NetInfoState } from '@react-native-community/netinfo'
import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { SearchResults as SearchResultsV2 } from 'features/search/pages/SearchResults/v2/SearchResults'
import {
  mockedAlgoliaArtistsResponse,
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import * as useNetInfoContext from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')

jest
  .spyOn(useNetInfoContext, 'useNetInfoContext')
  .mockReturnValue({ isConnected: true, isInternetReachable: true } as NetInfoState)

const mockDispatch = jest.fn()
const isFocusOnSuggestions = false
const mockSearchState = {
  searchState: initialSearchState,
  dispatch: mockDispatch,
  resetSearch: jest.fn(),
  isFocusOnSuggestions,
  showSuggestions: jest.fn(),
  hideSuggestions: jest.fn(),
}

const mockOffersResponse = {
  ...mockedAlgoliaResponse,
  nbHits: mockedAlgoliaResponse.hits.length,
  userData: null,
}
jest.mock('features/search/queries/useSearchOffersQuery/useSearchOffersQuery', () => ({
  useSearchOffersQuery: () => ({
    data: { offers: mockOffersResponse.hits },
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    isFetching: false,
    refetch: jest.fn(),
    isRefetching: false,
    isLoading: false,
    isSuccess: true,
  }),
}))

const mockArtistsResponse = mockedAlgoliaArtistsResponse.hits
jest.mock('features/search/queries/useSearchArtists/useSearchArtistsQuery', () => ({
  useSearchArtistsQuery: () => ({
    data: mockArtistsResponse,
    isLoading: false,
    isFetching: false,
    isSuccess: true,
  }),
}))

const mockVenuesResponse = {
  ...mockedAlgoliaVenueResponse,
  nbHits: mockedAlgoliaVenueResponse.hits.length,
  userData: null,
}
jest.mock('features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery', () => ({
  useSearchVenuesQuery: () => ({
    data: { algoliaVenues: mockVenuesResponse.hits },
    isLoading: false,
    isFetching: false,
    isSuccess: true,
  }),
}))

describe('Search Results V2', () => {
  it('should display search tabs when `isFocusOnSuggestions` is false', () => {
    getUseSearch()

    render(reactQueryProviderHOC(<SearchResultsV2 />))

    expect(screen.getByTestId('offers-search-tab')).toBeOnTheScreen()
    expect(screen.getByTestId('artists-search-tab')).toBeOnTheScreen()
    expect(screen.getByTestId('venues-search-tab')).toBeOnTheScreen()
  })

  it('should not display search tabs when `isFocusOnSuggestions` is true', () => {
    getUseSearch({ ...mockSearchState, isFocusOnSuggestions: true })

    render(reactQueryProviderHOC(<SearchResultsV2 />))

    expect(screen.queryByTestId('Offres-search-filter')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Artistes-search-filter')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Lieux-search-filter')).not.toBeOnTheScreen()
  })
})

const getUseSearch = (searchState?: ISearchContext) =>
  jest.spyOn(useSearch, 'useSearch').mockReturnValue(searchState ?? mockSearchState)
