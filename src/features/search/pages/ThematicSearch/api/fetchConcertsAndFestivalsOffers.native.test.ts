import algoliasearch from '__mocks__/algoliasearch'
import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchConcertsAndFestivalsOffers } from 'features/search/pages/ThematicSearch/api/fetchConcertsAndFestivalsOffers'
import { Position } from 'libs/location/location'

describe('fetchConcertsAndFestivalsOffers', () => {
  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch music offers with productionB index when FF EnableReplicaAlgolia is on', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: true })
    await fetchConcertsAndFestivalsOffers({ userLocation, isReplicaAlgoliaIndexActive: true })

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })

  it('should execute `multipleQueries` to fetch music offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: false })
    await fetchConcertsAndFestivalsOffers({ userLocation, isReplicaAlgoliaIndexActive: false })

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
  }

  return [
    buildQueryHelper({
      ...commonQueryParams,
      filters: 'offer.subcategoryId:"CONCERT" AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters:
        'offer.subcategoryId:"FESTIVAL_MUSIQUE" AND NOT offer.last30DaysBookingsRange:"very-low"',
      withRadius: false,
    }),
  ]
}
