import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetAllVenues } from 'features/venueMap/useGetAllVenues'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeoCoordinates, Position } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

import { SearchResultsContent } from './SearchResultsContent'

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockUseSearchResult = jest.fn(() => ({
  data: mockData,
  hits: { offers: mockedAlgoliaResponse.hits, venues: mockedAlgoliaVenueResponse.hits },
  nbHits: mockedAlgoliaResponse.nbHits,
  isFetching: false,
  isLoading: false,
  hasNextPage: mockHasNextPage,
  fetchNextPage: mockFetchNextPage,
  isFetchingNextPage: true,
  refetch: jest.fn(),
  venuesUserData: [{ venue_playlist_title: 'test' }],
}))
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => mockUseSearchResult(),
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

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/search/helpers/useScrollToBottomOpacity/useScrollToBottomOpacity', () => ({
  useScrollToBottomOpacity: () => ({
    handleScroll: jest.fn(),
  }),
}))
jest.mock('features/location/helpers/useLocationState', () => ({
  useLocationState: () => ({
    onModalHideRef: { current: jest.fn() },
  }),
}))

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

jest.mock('features/venueMap/useGetAllVenues')
const mockUseGetAllVenues = useGetAllVenues as jest.Mock

jest.mock('features/venueMap/hook/useCenterOnLocation')
const mockUseCenterOnLocation = useCenterOnLocation as jest.Mock

jest.mock('features/venue/api/useVenueOffers')
jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('features/search/helpers/useSearchAndPlaylistVenues/useSearchAndPlaylistVenues', () => ({
  useSearchAndPlaylistVenues: jest.fn(),
}))

describe('SearchResultsContent component', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockUseGetAllVenues.mockReturnValue({ venues: venuesFixture })
    mockUseCenterOnLocation.mockReturnValue(jest.fn())
  })

  it('should not render tabs on web when feature flag map in search activated', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(reactQueryProviderHOC(<SearchResultsContent />))

    await screen.findByTestId('searchResultsList')

    expect(screen.queryByText('Liste')).not.toBeOnTheScreen()
    expect(screen.queryByText('Carte')).not.toBeOnTheScreen()
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
