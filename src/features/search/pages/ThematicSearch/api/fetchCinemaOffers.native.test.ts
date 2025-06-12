import mockdate from 'mockdate'

import algoliasearch from '__mocks__/algoliasearch'
import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchCinemaOffers } from 'features/search/pages/ThematicSearch/api/fetchCinemaOffers'
import { Position } from 'libs/location'

describe('fetchCinemaOffers', () => {
  beforeAll(() => {
    mockdate.set(new Date('2025-04-14T00:00:00.000Z'))
  })

  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch music offers with productionB index when FF EnableReplicaAlgolia is on', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: true })
    await fetchCinemaOffers({ userLocation, isReplicaAlgoliaIndexActive: true })

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })

  it('should execute `multipleQueries` to fetch cinema offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: false })

    await fetchCinemaOffers({ userLocation, isReplicaAlgoliaIndexActive: false })

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })
})

function buildQueries({
  userLocation,
  isReplicaAlgoliaIndexActive,
}: {
  userLocation: Position
  isReplicaAlgoliaIndexActive?: boolean
}) {
  const commonQueryParams = {
    indexName: isReplicaAlgoliaIndexActive ? 'algoliaOffersIndexNameB' : 'algoliaOffersIndexName',
    userLocation,
    distinct: true,
  }

  return [
    buildQueryHelper({
      ...commonQueryParams,
      filters: 'offer.subcategoryId:"SEANCE_CINE"',
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: 'offer.subcategoryId:"SEANCE_CINE"',
      numericFilters: 'offer.releaseDate: 1743984000 TO 1744588800',
    }),
    buildQueryHelper({
      ...commonQueryParams,
      userLocation: undefined,
      filters:
        'offer.nativeCategoryId:"CARTES_CINEMA" AND (offer.subcategoryId:"CARTE_CINE_MULTISEANCES" OR offer.subcategoryId:"CINE_VENTE_DISTANCE")',
    }),
  ]
}
