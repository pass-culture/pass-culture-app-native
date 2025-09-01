import { VenueTypeCodeKey } from 'api/gen'
import * as captureAlgoliaError from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { fetchMultipleOffers } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/fetchMultipleOffers'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { buildHitsPerPage } from 'libs/algolia/fetchAlgolia/utils'
import { LocationMode, PlaylistOffersParams } from 'libs/algolia/types'
import { env } from 'libs/environment/env'

const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries')
const mockCaptureAlgoliaError = jest.spyOn(captureAlgoliaError, 'captureAlgoliaError')

const mockParams1: PlaylistOffersParams = {
  offerParams: {
    beginningDatetime: undefined,
    date: null,
    endingDatetime: undefined,
    hitsPerPage: 10,
    isDigital: false,
    offerCategories: [],
    offerIsDuo: false,
    offerIsFree: false,
    offerSubcategories: [],
    priceRange: [0, 300],
    query: 'test',
    tags: [],
    timeRange: null,
    venue: {
      _geoloc: { lat: 48.8536, lng: 2.34199 },
      info: 'PARIS 6',
      label: 'Cinéma St André des Arts',
      venueId: 26235,
      isOpenToPublic: true,
      venue_type: VenueTypeCodeKey.MOVIE,
    },
  },
  locationParams: {
    aroundMeRadius: 100,
    aroundPlaceRadius: 100,
    selectedLocationMode: LocationMode.AROUND_ME,
    userLocation: { latitude: 48.90374, longitude: 2.48171 },
  },
}

const mockParams2: PlaylistOffersParams = { ...mockParams1, indexName: 'customIndex' }

const mockParamsList = [mockParams1, mockParams2]

describe('fetchMultipleOffers', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call multipleQueries with good params', async () => {
    await fetchMultipleOffers({
      paramsList: mockParamsList,
      isUserUnderage: false,
    })

    expect(mockMultipleQueries).toHaveBeenCalledWith([
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME, // default indexName,
        query: 'test',
        params: {
          ...buildHitsPerPage(10),
          ...buildOfferSearchParameters(mockParams1.offerParams, mockParams1.locationParams, false),
          attributesToHighlight: [],
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.isHeadline', 'artists'],
        },
      },
      {
        indexName: 'customIndex',
        query: 'test',
        params: {
          ...buildHitsPerPage(10),
          ...buildOfferSearchParameters(mockParams2.offerParams, mockParams2.locationParams, false),
          attributesToHighlight: [],
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.isHeadline', 'artists'],
        },
      },
    ])
  })

  it('should execute captureAlgoliaError when multipleQueries failed', async () => {
    const error = new Error('Algolia error')
    mockMultipleQueries.mockRejectedValueOnce(error)

    await fetchMultipleOffers({ paramsList: mockParamsList, isUserUnderage: false })

    expect(mockCaptureAlgoliaError).toHaveBeenCalledWith(error)
  })
})
