import { SearchResponse } from '@algolia/client-search'

import { fetchCinemaOffers } from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/fetchCinemaOffers'
import { cinemaPlaylistAlgoliaSnapshot } from 'features/search/pages/Search/SearchN1/category/Cinema/fixtures/cinemaPlaylistAlgoliaSnapshot'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Offer } from 'shared/offer/types'

describe('fetchCinemaOffers', () => {
  const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries').mockResolvedValue([
    {
      hits: cinemaPlaylistAlgoliaSnapshot,
    } as unknown as SearchResponse<Offer>,
  ])

  it('should execute `multipleQueries` to fetch cinema offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    await fetchCinemaOffers({ userLocation })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaTopOffersIndexName',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          filters: 'offer.subcategoryId:"SEANCE_CINE"',
          distinct: true,
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          hitsPerPage: 20,
        },
        query: '',
      },
      {
        indexName: 'algoliaTopOffersIndexName',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.releaseDate'],
          filters: 'offer.subcategoryId:"SEANCE_CINE"',
          distinct: true,
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          hitsPerPage: 30,
        },
        query: '',
      },
      {
        indexName: 'algoliaTopOffersIndexName',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          filters:
            'offer.nativeCategoryId:"CARTES_CINEMA" AND (offer.subcategoryId:"CARTE_CINE_MULTISEANCES" OR offer.subcategoryId:"CINE_VENTE_DISTANCE")',
          distinct: true,
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          hitsPerPage: 30,
        },
        query: '',
      },
    ])
  })

  it('should execute `multipleQueries` to fetch cinema offers even when no UserLocation', async () => {
    const userLocation = undefined
    await fetchCinemaOffers({ userLocation })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaTopOffersIndexName',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          filters: 'offer.subcategoryId:"SEANCE_CINE"',
          distinct: true,
          hitsPerPage: 20,
        },
        query: '',
      },
      {
        indexName: 'algoliaTopOffersIndexName',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [...offerAttributesToRetrieve, 'offer.releaseDate'],
          filters: 'offer.subcategoryId:"SEANCE_CINE"',
          distinct: true,
          hitsPerPage: 30,
        },
        query: '',
      },
      {
        indexName: 'algoliaTopOffersIndexName',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          filters:
            'offer.nativeCategoryId:"CARTES_CINEMA" AND (offer.subcategoryId:"CARTE_CINE_MULTISEANCES" OR offer.subcategoryId:"CINE_VENTE_DISTANCE")',
          distinct: true,
          hitsPerPage: 30,
        },
        query: '',
      },
    ])
  })

  it('should return empty array if there is an error with multiplqueries', async () => {
    mockMultipleQueries.mockRejectedValueOnce(new Error('Async error'))
    const userLocation = { latitude: 1, longitude: 2 }
    const result = await fetchCinemaOffers({ userLocation })

    expect(result).toStrictEqual([])
  })
})
