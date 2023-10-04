import { SearchResponse } from '@algolia/client-search'

import { VenueResponse } from 'api/gen'
import {
  BASE_URL,
  fetchGTLPlaylists,
  fetchOffersFromGTLPlaylist,
  FetchOffersFromGTLPlaylistProps,
} from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { ContentfulGtlPlaylistResponse } from 'features/gtlPlaylist/types'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'

describe('GTL Playlist API', () => {
  describe('fetchGTLPlaylists', () => {
    beforeEach(() => {
      mockServer.universalGet(`${BASE_URL}/entries`, contentfulGtlPlaylistSnap)
    })

    it('should return correct data', async () => {
      const result = await fetchGTLPlaylists({
        position: {
          latitude: 2,
          longitude: 2,
        },
        isUserUnderage: false,
        venue: {
          name: 'Une librairie',
          id: 123,
          city: 'Jest',
        } as VenueResponse,
      })

      expect(result).toEqual([
        { layout: 'two-items', offers: { hits: [] }, title: 'Jeunesse' },
        { layout: 'two-items', offers: { hits: [] }, title: 'Littérature' },
      ])
    })
  })

  describe('fetchOffersFromGTLPlaylist', () => {
    const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries').mockResolvedValue([
      {
        hits: [],
      } as unknown as SearchResponse<Offer>,
    ])

    const params: [ContentfulGtlPlaylistResponse, FetchOffersFromGTLPlaylistProps] = [
      [
        {
          fields: {
            algoliaParameters: {
              fields: {
                hitsPerPage: 20,
                gtlLevel: 1,
                gtlLabel: 'Littérature',
              },
            },
            displayParameters: {
              fields: {
                title: 'Ma Playlist Littérature',
                layout: 'one-item-medium',
                minOffers: 1,
              },
            },
          },
        },
      ],
      {
        isUserUnderage: false,
        position: {
          latitude: 2,
          longitude: 2,
        },
        venue: {
          name: 'Une librairie',
          id: 123,
          city: 'Jest',
        } as VenueResponse,
      },
    ]

    it('should execute `multipleQueries` to fetch offers', async () => {
      await fetchOffersFromGTLPlaylist(...params)

      expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
        {
          indexName: 'algoliaOffersIndexName',
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
              ['offer.gtl_level1:Littérature'],
              ['venue.id:123'],
            ],
            hitsPerPage: 20,
            numericFilters: [['offer.prices: 0 TO 300']],
          },
          query: undefined,
        },
      ])
    })

    it('should return a GTL playlist', async () => {
      const result = await fetchOffersFromGTLPlaylist(...params)

      expect(result).toEqual([
        {
          layout: 'one-item-medium',
          offers: {
            hits: [],
          },
          title: 'Ma Playlist Littérature',
        },
      ])
    })
  })
})
