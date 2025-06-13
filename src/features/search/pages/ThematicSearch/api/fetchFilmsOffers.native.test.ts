import algoliasearch from '__mocks__/algoliasearch'
import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { Position } from 'libs/location'

describe('fetchFilmsOffers', () => {
  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch films offers with productionB index when FF EnableReplicaAlgolia is on', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: true })
    await fetchFilmsOffers({ userLocation, isReplicaAlgoliaIndexActive: true })

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })

  it('should execute `multipleQueries` to fetch films offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: false })

    fetchFilmsOffers({ userLocation, isReplicaAlgoliaIndexActive: false })

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
  return [
    buildQueryHelper({
      indexName: isReplicaAlgoliaIndexActive ? 'algoliaOffersIndexNameB' : 'algoliaOffersIndexName',
      filters: 'offer.subcategoryId:"ABO_PLATEFORME_VIDEO"',
    }),
    buildQueryHelper({
      indexName: isReplicaAlgoliaIndexActive ? 'algoliaOffersIndexNameB' : 'algoliaOffersIndexName',
      filters: 'offer.subcategoryId:"VOD"',
    }),
    buildQueryHelper({
      indexName: 'algoliaOffersIndexName',
      filters:
        'offer.nativeCategoryId:"DVD_BLU_RAY" AND offer.subcategoryId:"SUPPORT_PHYSIQUE_FILM" AND NOT offer.last30DaysBookingsRange:"very-low"',
      userLocation,
    }),
  ]
}
