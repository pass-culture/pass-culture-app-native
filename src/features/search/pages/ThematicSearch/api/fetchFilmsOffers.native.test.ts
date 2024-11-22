import { SearchResponse } from '@algolia/client-search'

import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { filmsPlaylistAlgoliaSnapshot } from 'features/search/pages/ThematicSearch/Films/fixtures/filmsPlaylistAlgoliaSnapshot'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import * as multipleQueries from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Offer } from 'shared/offer/types'

describe('fetchFilmsOffers', () => {
  const mockMultipleQueries = jest.spyOn(multipleQueries, 'multipleQueries').mockResolvedValue([
    {
      hits: filmsPlaylistAlgoliaSnapshot,
    } as unknown as SearchResponse<Offer>,
  ])

  const userLocation = { latitude: 1, longitude: 2 }

  const filmsQueries = [
    {
      indexName: 'algoliaOffersIndexNameB',
      params: {
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        filters: 'offer.subcategoryId:"VOD"',
        hitsPerPage: 20,
      },
      query: '',
    },
    {
      indexName: 'algoliaOffersIndexName',
      params: {
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        filters:
          'offer.nativeCategoryId:"DVD_BLU_RAY" AND offer.subcategoryId:"SUPPORT_PHYSIQUE_FILM" AND NOT offer.last30DaysBookingsRange:"low"',
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 50000,
        hitsPerPage: 20,
      },
      query: '',
    },
    {
      indexName: 'algoliaOffersIndexNameB',
      params: {
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        filters: 'offer.subcategoryId:"ABO_PLATEFORME_VIDEO"',
        hitsPerPage: 20,
      },
      query: '',
    },
  ]

  const filmsQueriesWithoutUserLocation = [
    {
      ...filmsQueries[0],
      params: {
        ...filmsQueries[0]?.params,
      },
    },
    {
      ...filmsQueries[1],
      params: {
        attributesToHighlight: [],
        attributesToRetrieve: offerAttributesToRetrieve,
        filters:
          'offer.nativeCategoryId:"DVD_BLU_RAY" AND offer.subcategoryId:"SUPPORT_PHYSIQUE_FILM" AND NOT offer.last30DaysBookingsRange:"low"',
        hitsPerPage: 20,
      },
    },
    {
      ...filmsQueries[2],
      params: {
        ...filmsQueries[2]?.params,
      },
    },
  ]

  it('should execute `multipleQueries` to fetch films offers', async () => {
    fetchFilmsOffers(userLocation)

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, filmsQueries)
  })

  it('should execute `multipleQueries` to fetch films offers even when no UserLocation', async () => {
    fetchFilmsOffers(undefined)

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, filmsQueriesWithoutUserLocation)
  })
})
