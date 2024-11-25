import mockdate from 'mockdate'

import algoliasearch from '__mocks__/algoliasearch'
import { fetchCinemaOffers } from 'features/search/pages/ThematicSearch/api/fetchCinemaOffers'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'

describe('fetchCinemaOffers', () => {
  beforeAll(() => {
    mockdate.set(new Date('2025-04-14T00:00:00.000Z'))
  })

  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch cinema offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    await fetchCinemaOffers(userLocation)

    expect(multipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaOffersIndexNameB',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          filters: 'offer.subcategoryId:"SEANCE_CINE"',
          distinct: true,
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
          filters: 'offer.subcategoryId:"SEANCE_CINE"',
          distinct: true,
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          aroundRadius: 50000,
          hitsPerPage: 30,
          numericFilters: 'offer.releaseDate: 1743984000 TO 1744588800',
        },
        query: '',
      },
      {
        indexName: 'algoliaOffersIndexNameB',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          filters:
            'offer.nativeCategoryId:"CARTES_CINEMA" AND (offer.subcategoryId:"CARTE_CINE_MULTISEANCES" OR offer.subcategoryId:"CINE_VENTE_DISTANCE")',
          distinct: true,
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          aroundRadius: 50000,
          hitsPerPage: 30,
        },
        query: '',
      },
    ])
  })

  it('should execute `multipleQueries` to fetch cinema offers even when no UserLocation', async () => {
    const userLocation = undefined
    await fetchCinemaOffers(userLocation)

    expect(multipleQueries).toHaveBeenNthCalledWith(1, [
      {
        indexName: 'algoliaOffersIndexNameB',
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
        indexName: 'algoliaOffersIndexNameB',
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: offerAttributesToRetrieve,
          filters: 'offer.subcategoryId:"SEANCE_CINE"',
          distinct: true,
          hitsPerPage: 30,
          numericFilters: 'offer.releaseDate: 1743984000 TO 1744588800',
        },
        query: '',
      },
      {
        indexName: 'algoliaOffersIndexNameB',
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
    multipleQueries.mockRejectedValueOnce(new Error('Async error'))
    const userLocation = { latitude: 1, longitude: 2 }
    const result = await fetchCinemaOffers(userLocation)

    expect(result).toStrictEqual([])
  })
})
