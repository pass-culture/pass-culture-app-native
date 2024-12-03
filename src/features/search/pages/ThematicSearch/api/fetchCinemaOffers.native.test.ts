import mockdate from 'mockdate'

import algoliasearch from '__mocks__/algoliasearch'
import { fetchCinemaOffers } from 'features/search/pages/ThematicSearch/api/fetchCinemaOffers'
import { buildQuery } from 'features/search/pages/ThematicSearch/api/utils'
import { Position } from 'libs/location'

describe('fetchCinemaOffers', () => {
  beforeAll(() => {
    mockdate.set(new Date('2025-04-14T00:00:00.000Z'))
  })

  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch cinema offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries(userLocation)

    await fetchCinemaOffers(userLocation)

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })
})

function buildQueries(userLocation: Position) {
  const commonQueryParams = {
    indexName: 'algoliaOffersIndexNameB',
    userLocation,
    distinct: true,
  }

  return [
    buildQuery({
      ...commonQueryParams,
      hitsPerPage: 20,
      filters: 'offer.subcategoryId:"SEANCE_CINE"',
    }),
    buildQuery({
      ...commonQueryParams,
      hitsPerPage: 30,
      filters: 'offer.subcategoryId:"SEANCE_CINE"',
      numericFilters: 'offer.releaseDate: 1743984000 TO 1744588800',
    }),
    buildQuery({
      ...commonQueryParams,
      hitsPerPage: 30,
      filters:
        'offer.nativeCategoryId:"CARTES_CINEMA" AND (offer.subcategoryId:"CARTE_CINE_MULTISEANCES" OR offer.subcategoryId:"CINE_VENTE_DISTANCE")',
    }),
  ]
}
