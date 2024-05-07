import { SearchResponse } from '@algolia/client-search'

import { PlaylistOffersParams } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { fetchOffersByGTL } from 'libs/algolia/fetchAlgolia/fetchOffersByGTL'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { LocationMode } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

describe('fetchOffersByGTL', () => {
  const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries').mockResolvedValue([
    {
      hits: [],
    } as unknown as SearchResponse<Offer>,
  ])

  const params: [PlaylistOffersParams[], BuildLocationParameterParams, boolean] = [
    [
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
          },
        },
        locationParams: {
          selectedLocationMode: LocationMode.EVERYWHERE,
          userLocation: null,
          aroundMeRadius: 'all',
          aroundPlaceRadius: 'all',
        },
      },
    ],
    {
      userLocation: {
        latitude: 2,
        longitude: 2,
      },
      selectedLocationMode: LocationMode.AROUND_ME,
      aroundMeRadius: 'all',
      aroundPlaceRadius: 'all',
    },
    false,
  ]

  it('should execute `multipleQueries` to fetch offers', async () => {
    await fetchOffersByGTL(...params)

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaVenueOffersIndexName',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          facetFilters: [
            ['offer.isEducational:false'],
            ['offer.gtl_level3:Romance'],
            ['venue.id:123'],
          ],
          hitsPerPage: 35,
          numericFilters: [['offer.prices: 0 TO 300'], ['offer.last30DaysBookings >= 5']],
        },
        query: undefined,
      },
    ])
  })

  it('should return a GTL playlist', async () => {
    const result = await fetchOffersByGTL(...params)

    expect(result).toEqual([
      {
        hits: [],
      },
    ])
  })
})
