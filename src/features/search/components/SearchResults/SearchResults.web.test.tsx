import { Hit } from '@algolia/client-search'
import React from 'react'

import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'
import { act, render, screen } from 'tests/utils/web'

import { SearchResults } from './SearchResults'

jest.mock('react-query')

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()

let mockOffers: Hit<Offer>[] = []
let mockNbHits = 0

jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: { offers: mockOffers, venues: mockedAlgoliaVenueResponse.hits },
    nbHits: mockNbHits,
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

jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

jest.mock('features/search/helpers/useScrollToBottomOpacity/useScrollToBottomOpacity', () => ({
  useScrollToBottomOpacity: () => ({
    handleScroll: jest.fn(),
  }),
}))

describe('SearchResults component', () => {
  beforeEach(() => {
    mockOffers = []
    mockNbHits = 0
  })

  it('should not render list if empty', async () => {
    render(<SearchResults />)
    await act(async () => {}) // fix 3 warnings "Warning: An update to %s inside a test was not wrapped in act" for PriceModal, LocationModal and DatesHoursModal

    expect(() => screen.getByTestId('searchResultsList')).toThrow()
  })

  it('should render correctly', async () => {
    mockOffers = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits

    const renderAPI = render(<SearchResults />)
    await act(async () => {}) // fix 3 warnings "Warning: An update to %s inside a test was not wrapped in act" for PriceModal, LocationModal and DatesHoursModal
    await screen.findByTestId('searchResultsList')

    expect(renderAPI).toMatchSnapshot()
  })
})
