import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { SearchState } from 'features/search/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import * as useVenueSearchParameters from 'features/venue/helpers/useVenueSearchParameters'
import mockVenueResponse from 'fixtures/venueResponse'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import { LocationMode, Position } from 'libs/location/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 48.90374, longitude: 2.48171 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

const venueSearchParamsMock: SearchState = {
  beginningDatetime: undefined,
  endingDatetime: undefined,
  hitsPerPage: 30,
  locationFilter: {
    locationType: LocationMode.EVERYWHERE,
  },
  venue: {
    label: mockVenueResponse.publicName || '',
    info: mockVenueResponse.city || '',
    _geoloc: {
      lat: mockVenueResponse.latitude,
      lng: mockVenueResponse.longitude,
    },
    venueId: mockVenueResponse.id,
  },
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  isDigital: false,
  priceRange: [0, 300],
  tags: [],
  date: null,
  timeRange: null,
  query: '',
}

jest
  .spyOn(useVenueSearchParameters, 'useVenueSearchParameters')
  .mockReturnValue(venueSearchParamsMock)

jest.mock('features/profile/helpers/useIsUserUnderage')
jest.spyOn(UnderageUserAPI, 'useIsUserUnderage').mockReturnValue(false)

jest.mock('libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers')
const mockFetchMultipleOffers = fetchMultipleOffers as jest.Mock

const mockUseAuthContext = jest.fn().mockReturnValue({
  user: undefined,
  isLoggedIn: false,
})
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

jest.mock('libs/firebase/analytics/analytics')

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

const EXPECTED_CALL_PARAM = {
  indexName: 'algoliaTopOffersIndexName',
  isUserUnderage: false,
  paramsList: [
    {
      locationParams: {
        aroundMeRadius: 100,
        aroundPlaceRadius: 100,
        selectedLocationMode: 'AROUND_ME',
        userLocation: { latitude: 48.90374, longitude: 2.48171 },
      },
      offerParams: {
        venue: {
          _geoloc: { lat: 48.8536, lng: 2.34199 },
          info: 'PARIS 6',
          label: 'Cinéma St André des Arts',
          venueId: 26235,
        },
      },
    },
    {
      locationParams: {
        aroundMeRadius: 100,
        aroundPlaceRadius: 100,
        selectedLocationMode: 'AROUND_ME',
        userLocation: { latitude: 48.90374, longitude: 2.48171 },
      },
      offerParams: {
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        hitsPerPage: 30,
        isDigital: false,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [],
        offerIsDuo: false,
        offerIsFree: false,
        offerSubcategories: [],
        priceRange: [0, 300],
        query: '',
        tags: [],
        timeRange: null,
        venue: {
          _geoloc: { lat: 48.8536, lng: 2.34199 },
          info: 'PARIS 6',
          label: 'Cinéma St André des Arts',
          venueId: 26235,
        },
      },
    },
  ],
}

describe('useVenueOffers', () => {
  it('should call multiple fetch offers algolia request', async () => {
    renderHook(() => useVenueOffers(mockVenueResponse), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => expect(mockFetchMultipleOffers).toHaveBeenCalledWith(EXPECTED_CALL_PARAM))
  })
})