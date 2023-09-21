import { SearchResponse } from '@algolia/client-search'
import { rest } from 'msw'

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
import { server } from 'tests/server'

describe('GTL Playlist API', () => {
  describe('fetchGTLPlaylists', () => {
    server.use(
      rest.get(`${BASE_URL}/entries`, (req, res, context) => {
        return res(context.status(200), context.json(contentfulGtlPlaylistSnap))
      })
    )

    it('should return correct data', async () => {
      const result = await fetchGTLPlaylists({
        position: {
          latitude: 2,
          longitude: 2,
        },
        isUserUnderage: false,
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
      },
    ]

    it('should execute `multipleQueries` to fetch offers', async () => {
      await fetchOffersFromGTLPlaylist(...params)

      expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
        {
          indexName: 'algoliaOffersIndexName',
          params: {
            aroundLatLng: '2, 2',
            aroundRadius: 100000,
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
            facetFilters: [['offer.isEducational:false'], ['offer.gtl_level1:Littérature']],
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
