import { SubcategoryIdEnum } from 'api/gen'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { SearchState } from 'features/search/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import * as useVenueSearchParameters from 'features/venue/helpers/useVenueSearchParameters'
import mockVenueResponse from 'fixtures/venueResponse'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import {
  filterOfferHitWithImage,
  transformOfferHit,
} from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer, HitOffer } from 'libs/algolia/types'
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
  hitsPerPage: 50,
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

jest.mock('libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers', () => ({
  fetchMultipleOffers: jest.fn(),
}))
const mockFetchMultipleOffers = fetchMultipleOffers as jest.MockedFunction<
  typeof fetchMultipleOffers
>

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
  isUserUnderage: false,
  paramsList: [
    {
      indexName: 'algoliaOffersIndexName',
      locationParams: {
        aroundMeRadius: 100,
        aroundPlaceRadius: 100,
        selectedLocationMode: 'AROUND_ME',
        userLocation: { latitude: 48.90374, longitude: 2.48171 },
      },
      offerParams: {
        hitsPerPage: 50,
        venue: {
          _geoloc: { lat: 48.8536, lng: 2.34199 },
          info: 'PARIS 6',
          label: 'Cinéma St André des Arts',
          venueId: 26235,
        },
      },
    },
    {
      indexName: 'algoliaTopOffersIndexName',
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
        hitsPerPage: 50,
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
    {
      indexName: 'algoliaOffersIndexName',
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
        hitsPerPage: 50,
        isDigital: false,
        isHeadline: true,
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
  it('should call multiple fetch offers algolia request and return correct response object', async () => {
    const FETCH_MULTIPLE_OFFERS_RESPONSE = [
      {
        hits: [
          {
            offer: {
              dates: [],
              isDigital: false,
              isDuo: false,
              name: 'I want something more',
              prices: [28.0],
              subcategoryId: SubcategoryIdEnum.CONCERT,
              thumbUrl:
                'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
              artist: 'Céline Dion',
            },
            _geoloc: { lat: 4.90339, lng: -52.31663 },
            objectID: '102310',
            venue: {
              id: 4,
              name: 'Lieu 4',
              publicName: 'Lieu 4',
              address: '4 rue de la paix',
              postalCode: '75000',
              city: 'Paris',
            },
          },
        ],
        nbHits: 1,
      },
      {
        hits: [],
        nbHits: 0,
      },
      {
        hits: [
          {
            offer: {
              dates: [],
              isDigital: false,
              isDuo: false,
              name: 'Naruto T3',
              prices: [28.0],
              subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
              thumbUrl:
                'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
              artist: 'Masashi Kishimoto',
            },
            _geoloc: { lat: 4.90339, lng: -52.31663 },
            objectID: '102310',
            venue: {
              id: 4,
              name: 'Lieu 4',
              publicName: 'Lieu 4',
              address: '4 rue de la paix',
              postalCode: '75000',
              city: 'Paris',
            },
          },
        ],
        nbHits: 1,
      },
    ]
    mockFetchMultipleOffers.mockResolvedValueOnce(FETCH_MULTIPLE_OFFERS_RESPONSE)

    const { result } = renderHook(() => useVenueOffers(mockVenueResponse), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => expect(mockFetchMultipleOffers).toHaveBeenCalledWith(EXPECTED_CALL_PARAM))

    expect(result.current.data?.hits).toMatchObject(
      FETCH_MULTIPLE_OFFERS_RESPONSE.slice(0, 2)
        .flatMap((result) => result?.hits)
        .filter(filterOfferHitWithImage)
        .map(transformOfferHit())
    )

    const headlineOffer = FETCH_MULTIPLE_OFFERS_RESPONSE.at(-1)?.hits[0]

    expect(result.current.data?.headlineOffer).toMatchObject(
      transformOfferHit()(headlineOffer ?? ({} as AlgoliaOffer<HitOffer>))
    )
  })
})
