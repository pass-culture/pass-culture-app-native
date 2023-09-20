import { SearchResponse } from '@algolia/client-search'
import { rest } from 'msw'

import {
  BASE_URL,
  fetchGTLPlaylists,
  fetchOffersFromGTLPlaylist,
} from 'features/gtl/api/gtl-playlist-api'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Offer } from 'shared/offer/types'
import { server } from 'tests/server'

describe('GTL Playlist API', () => {
  describe('fetchGTLPlaylists', () => {
    server.use(
      rest.get(`${BASE_URL}/entries`, (req, res, context) => {
        return res(
          context.status(200),
          context.json({
            sys: {
              type: 'Array',
            },
            total: 2,
            skip: 0,
            limit: 100,
            items: [
              {
                metadata: {
                  tags: [],
                },
                sys: {
                  space: {
                    sys: {
                      type: 'Link',
                      linkType: 'Space',
                      id: '2bg01iqy0isv',
                    },
                  },
                  id: '7FqRezKdV0mcUjOYerCUuJ',
                  type: 'Entry',
                  createdAt: '2023-09-14T13:06:25.866Z',
                  updatedAt: '2023-09-14T13:06:25.866Z',
                  environment: {
                    sys: {
                      id: 'testing',
                      type: 'Link',
                      linkType: 'Environment',
                    },
                  },
                  revision: 1,
                  contentType: {
                    sys: {
                      type: 'Link',
                      linkType: 'ContentType',
                      id: 'gtlPlaylist',
                    },
                  },
                  locale: 'en-US',
                },
                fields: {
                  title: 'Jeunesse',
                  algoliaParameters: {
                    sys: {
                      type: 'Link',
                      linkType: 'Entry',
                      id: '2cBHoyWf94VMJyiZXxbyQu',
                    },
                  },
                  displayParameters: {
                    sys: {
                      type: 'Link',
                      linkType: 'Entry',
                      id: '4szYVNtk1X4mP0GPGcF769',
                    },
                  },
                },
              },
              {
                metadata: {
                  tags: [],
                },
                sys: {
                  space: {
                    sys: {
                      type: 'Link',
                      linkType: 'Space',
                      id: '2bg01iqy0isv',
                    },
                  },
                  id: '2xUlLBRfxdk6jeYyJszunX',
                  type: 'Entry',
                  createdAt: '2023-09-13T13:26:37.563Z',
                  updatedAt: '2023-09-13T13:26:37.563Z',
                  environment: {
                    sys: {
                      id: 'testing',
                      type: 'Link',
                      linkType: 'Environment',
                    },
                  },
                  revision: 1,
                  contentType: {
                    sys: {
                      type: 'Link',
                      linkType: 'ContentType',
                      id: 'gtlPlaylist',
                    },
                  },
                  locale: 'en-US',
                },
                fields: {
                  title: 'Littérature',
                  algoliaParameters: {
                    sys: {
                      type: 'Link',
                      linkType: 'Entry',
                      id: '1uc3mnvV7mIqhyddM8lKPn',
                    },
                  },
                  displayParameters: {
                    sys: {
                      type: 'Link',
                      linkType: 'Entry',
                      id: '63aHMAZD0NxIREYx675tYq',
                    },
                  },
                },
              },
            ],
            includes: {
              Entry: [
                {
                  metadata: {
                    tags: [],
                  },
                  sys: {
                    space: {
                      sys: {
                        type: 'Link',
                        linkType: 'Space',
                        id: '2bg01iqy0isv',
                      },
                    },
                    id: '1uc3mnvV7mIqhyddM8lKPn',
                    type: 'Entry',
                    createdAt: '2023-09-13T13:13:11.157Z',
                    updatedAt: '2023-09-13T13:13:11.157Z',
                    environment: {
                      sys: {
                        id: 'testing',
                        type: 'Link',
                        linkType: 'Environment',
                      },
                    },
                    revision: 1,
                    contentType: {
                      sys: {
                        type: 'Link',
                        linkType: 'ContentType',
                        id: 'algoliaParameters',
                      },
                    },
                    locale: 'en-US',
                  },
                  fields: {
                    title: 'Littérature',
                    isGeolocated: false,
                    hitsPerPage: 35,
                    gtlLevel: 1,
                    gtlLabel: 'Littérature',
                  },
                },
                {
                  metadata: {
                    tags: [],
                  },
                  sys: {
                    space: {
                      sys: {
                        type: 'Link',
                        linkType: 'Space',
                        id: '2bg01iqy0isv',
                      },
                    },
                    id: '2cBHoyWf94VMJyiZXxbyQu',
                    type: 'Entry',
                    createdAt: '2023-09-14T13:06:05.773Z',
                    updatedAt: '2023-09-14T13:06:05.773Z',
                    environment: {
                      sys: {
                        id: 'testing',
                        type: 'Link',
                        linkType: 'Environment',
                      },
                    },
                    revision: 1,
                    contentType: {
                      sys: {
                        type: 'Link',
                        linkType: 'ContentType',
                        id: 'algoliaParameters',
                      },
                    },
                    locale: 'en-US',
                  },
                  fields: {
                    title: 'Jeunesse',
                    hitsPerPage: 35,
                    gtlLevel: 1,
                    gtlLabel: 'Jeunesse',
                  },
                },
                {
                  metadata: {
                    tags: [],
                  },
                  sys: {
                    space: {
                      sys: {
                        type: 'Link',
                        linkType: 'Space',
                        id: '2bg01iqy0isv',
                      },
                    },
                    id: '4szYVNtk1X4mP0GPGcF769',
                    type: 'Entry',
                    createdAt: '2023-09-14T13:06:13.073Z',
                    updatedAt: '2023-09-14T14:29:07.319Z',
                    environment: {
                      sys: {
                        id: 'testing',
                        type: 'Link',
                        linkType: 'Environment',
                      },
                    },
                    revision: 2,
                    contentType: {
                      sys: {
                        type: 'Link',
                        linkType: 'ContentType',
                        id: 'displayParameters',
                      },
                    },
                    locale: 'en-US',
                  },
                  fields: {
                    title: 'Jeunesse',
                    layout: 'two-items',
                    minOffers: 1,
                  },
                },
                {
                  metadata: {
                    tags: [],
                  },
                  sys: {
                    space: {
                      sys: {
                        type: 'Link',
                        linkType: 'Space',
                        id: '2bg01iqy0isv',
                      },
                    },
                    id: '63aHMAZD0NxIREYx675tYq',
                    type: 'Entry',
                    createdAt: '2023-09-13T13:12:27.770Z',
                    updatedAt: '2023-09-14T14:29:33.822Z',
                    environment: {
                      sys: {
                        id: 'testing',
                        type: 'Link',
                        linkType: 'Environment',
                      },
                    },
                    revision: 2,
                    contentType: {
                      sys: {
                        type: 'Link',
                        linkType: 'ContentType',
                        id: 'displayParameters',
                      },
                    },
                    locale: 'en-US',
                  },
                  fields: {
                    title: 'Littérature',
                    layout: 'two-items',
                    minOffers: 1,
                  },
                },
              ],
            },
          })
        )
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

    it('should work', async () => {
      const result = await fetchOffersFromGTLPlaylist(
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
        }
      )

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
            facetFilters: [['offer.isEducational:false']],
            hitsPerPage: 20,
            numericFilters: [['offer.prices: 0 TO 300']],
          },
          query: undefined,
        },
      ])

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
