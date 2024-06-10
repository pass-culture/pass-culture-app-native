import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { mockedAlgoliaVenueResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

import { SearchResultsContent } from './SearchResultsContent'

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: { offers: [], venues: mockedAlgoliaVenueResponse.hits },
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
    refetch: jest.fn(),
    venuesUserData: [{ venue_playlist_title: 'test' }],
  }),
}))

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
const mockPosition: Position = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('SearchResultsContent component', () => {
  it('should render correctly', async () => {
    const { container } = render(reactQueryProviderHOC(<SearchResultsContent />))

    await screen.findByTestId('searchResultsList')

    expect(container).toMatchSnapshot()
  })
})
