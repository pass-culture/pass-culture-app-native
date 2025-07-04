import { SubcategoryIdEnum } from 'api/gen'
import mockVenueResponse from 'fixtures/venueResponse'
import mockVenueSearchParams from 'fixtures/venueSearchParams'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import {
  filterOfferHitWithImage,
  transformOfferHit,
} from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer, HitOffer } from 'libs/algolia/types'
import { LocationMode, Position } from 'libs/location/types'
import { useVenueOffersQuery } from 'queries/venue/useVenueOffersQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 48.90374, longitude: 2.48171 }

jest.mock('libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers', () => ({
  fetchMultipleOffers: jest.fn(),
}))
const mockFetchMultipleOffers = fetchMultipleOffers as jest.MockedFunction<
  typeof fetchMultipleOffers
>

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
      offerParams: mockVenueSearchParams,
    },
    {
      indexName: 'algoliaTopOffersIndexName',
      locationParams: {
        aroundMeRadius: 100,
        aroundPlaceRadius: 100,
        selectedLocationMode: 'AROUND_ME',
        userLocation: { latitude: 48.90374, longitude: 2.48171 },
      },
      offerParams: mockVenueSearchParams,
    },
    {
      indexName: 'algoliaOffersIndexName',
      locationParams: {
        aroundMeRadius: 100,
        aroundPlaceRadius: 100,
        selectedLocationMode: 'AROUND_ME',
        userLocation: { latitude: 48.90374, longitude: 2.48171 },
      },
      offerParams: { ...mockVenueSearchParams, isHeadline: true },
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

    const { result } = renderHook(
      () =>
        useVenueOffersQuery({
          userLocation: mockUserLocation,
          selectedLocationMode: mockLocationMode,
          venue: mockVenueResponse,
          isUserUnderage: false,
          venueSearchParams: mockVenueSearchParams,
          transformHits: transformOfferHit(),
          searchState: mockVenueSearchParams,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )
    await waitFor(() => expect(mockFetchMultipleOffers).toHaveBeenCalledWith(EXPECTED_CALL_PARAM))

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

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
