import algoliasearch from '__mocks__/algoliasearch'
import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { buildQuery } from 'features/search/pages/ThematicSearch/api/utils'
import { Position } from 'libs/location'

describe('fetchFilmsOffers', () => {
  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch films offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries(userLocation)

    fetchFilmsOffers(userLocation)

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })
})

function buildQueries(userLocation: Position) {
  return [
    buildQuery({
      indexName: 'algoliaOffersIndexNameB',
      filters: 'offer.subcategoryId:"ABO_PLATEFORME_VIDEO"',
    }),
    buildQuery({
      indexName: 'algoliaOffersIndexNameB',
      filters: 'offer.subcategoryId:"VOD"',
    }),
    buildQuery({
      indexName: 'algoliaOffersIndexName',
      filters:
        'offer.nativeCategoryId:"DVD_BLU_RAY" AND offer.subcategoryId:"SUPPORT_PHYSIQUE_FILM" AND NOT offer.last30DaysBookingsRange:"very-low"',
      userLocation,
    }),
  ]
}
