import algoliasearch from '__mocks__/algoliasearch'
import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchConcertsAndFestivalsOffers } from 'features/search/pages/ThematicSearch/api/fetchConcertsAndFestivalsOffers'
import { Position } from 'libs/location'

describe('fetchConcertsAndFestivalsOffers', () => {
  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch music offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries(userLocation)
    await fetchConcertsAndFestivalsOffers(userLocation)

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })
})

function buildQueries(userLocation: Position) {
  const commonQueryParams = {
    indexName: 'algoliaOffersIndexNameB',
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
