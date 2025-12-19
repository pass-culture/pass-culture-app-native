import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchMusicOffers } from 'features/search/pages/ThematicSearch/api/fetchMusicOffers'
import * as multipleQueriesAPI from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Position } from 'libs/location/location'

const mockMultipleQueries = jest.spyOn(multipleQueriesAPI, 'multipleQueries').mockResolvedValue([])

describe('fetchMusicOffers', () => {
  it('should execute `multipleQueries` to fetch music offers with productionB index when FF EnableReplicaAlgolia is on', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: true })
    await fetchMusicOffers({ userLocation, isReplicaAlgoliaIndexActive: true })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, queries)
  })

  it('should execute `multipleQueries` to fetch music offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries({ userLocation, isReplicaAlgoliaIndexActive: false })
    await fetchMusicOffers({ userLocation, isReplicaAlgoliaIndexActive: false })

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, queries)
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
      userLocation: undefined,
      filters:
        '(offer.subcategoryId:"ABO_PLATEFORME_MUSIQUE" OR offer.subcategoryId:"LIVESTREAM_MUSIQUE" OR offer.subcategoryId:"TELECHARGEMENT_MUSIQUE") AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
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
    buildQueryHelper({
      ...commonQueryParams,
      filters:
        '(offer.subcategoryId:"ACHAT_INSTRUMENT" OR offer.subcategoryId:"LOCATION_INSTRUMENT") AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters:
        'offer.subcategoryId:"SUPPORT_PHYSIQUE_MUSIQUE_CD" AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters:
        'offer.subcategoryId:"SUPPORT_PHYSIQUE_MUSIQUE_VINYLE" AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
  ]
}
