import React from 'react'

import { mockedAlgoliaVenueResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils/web'

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

describe('SearchResultsContent component', () => {
  it('should render correctly', async () => {
    const renderAPI = render(reactQueryProviderHOC(<SearchResultsContent />))
    await act(async () => {}) // fix 3 warnings "Warning: An update to %s inside a test was not wrapped in act" for PriceModal, LocationModal and DatesHoursModal
    await screen.findByTestId('searchResultsList')

    expect(renderAPI).toMatchSnapshot()
  })
})
