import { SearchResponse } from 'algoliasearch/lite'

import { VenueTypeCodeKey } from 'api/gen'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { LocationMode, PlaylistOffersParams } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

describe('fetchOffersByGTL', () => {
  const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries').mockResolvedValue([
    {
      hits: [],
    } as unknown as SearchResponse<Offer>,
  ])

  const playlistOffersParams: PlaylistOffersParams[] = [
    {
      offerParams: {
        hitsPerPage: 35,
        offerCategories: [],
        offerSubcategories: [],
        offerIsDuo: false,
        isDigital: false,
        priceRange: [0, 300],
        tags: [],
        date: null,
        timeRange: null,
        query: '',
        minBookingsThreshold: 5,
        offerGenreTypes: [],
        offerGtlLabel: 'Romance',
        offerGtlLevel: 3,
        venue: {
          venueId: 123,
          info: 'BAYONNE',
          label: 'DARRIEUMERLOU',
          isOpenToPublic: true,
          venue_type: VenueTypeCodeKey.BOOKSTORE,
        },
      },
      locationParams: {
        selectedLocationMode: LocationMode.EVERYWHERE,
        userLocation: null,
        aroundMeRadius: 'all',
        aroundPlaceRadius: 'all',
      },
    },
  ]

  const locationParameterParams: BuildLocationParameterParams = {
    userLocation: {
      latitude: 2,
      longitude: 2,
    },
    selectedLocationMode: LocationMode.AROUND_ME,
    aroundMeRadius: 'all',
    aroundPlaceRadius: 'all',
  }

  const fetchOffersByGTLArgs = {
    parameters: playlistOffersParams,
    buildLocationParameterParams: locationParameterParams,
    isUserUnderage: false,
  }

  it('should execute `multipleQueries` to fetch offers', async () => {
    await fetchOffersByGTL(fetchOffersByGTLArgs)

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaTopOffersIndexName',
        query: '',
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.gtl_level3:Romance'],
          ['venue.id:123'],
        ],
        hitsPerPage: 35,
        numericFilters: [['offer.prices: 0 TO 300'], ['offer.last30DaysBookings >= 5']],
      },
    ])
  })

  it('should return a GTL playlist', async () => {
    const result = await fetchOffersByGTL(fetchOffersByGTLArgs)

    expect(result).toEqual([
      {
        hits: [],
      },
    ])
  })

  it('should execute query with given search index if given', async () => {
    await fetchOffersByGTL({ ...fetchOffersByGTLArgs, searchIndex: 'algoliaTopOffersIndexNameB' })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaTopOffersIndexNameB',
        query: '',
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        facetFilters: [
          ['offer.isEducational:false'],
          ['offer.gtl_level3:Romance'],
          ['venue.id:123'],
        ],
        hitsPerPage: 35,
        numericFilters: [['offer.prices: 0 TO 300'], ['offer.last30DaysBookings >= 5']],
      },
    ])
  })
})
