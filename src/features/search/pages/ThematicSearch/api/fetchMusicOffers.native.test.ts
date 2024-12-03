import algoliasearch from '__mocks__/algoliasearch'
import { fetchMusicOffers } from 'features/search/pages/ThematicSearch/api/fetchMusicOffers'
import { buildQuery } from 'features/search/pages/ThematicSearch/api/utils'
import { Position } from 'libs/location'

describe('fetchMusicOffers', () => {
  const { multipleQueries } = algoliasearch()

  it('should execute `multipleQueries` to fetch music offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queries = buildQueries(userLocation)
    await fetchMusicOffers(userLocation)

    expect(multipleQueries).toHaveBeenNthCalledWith(1, queries)
  })
})

function buildQueries(userLocation: Position) {
  const commonQueryParams = {
    indexName: 'algoliaOffersIndexNameB',
    userLocation,
    hitsPerPage: 20,
  }

  return [
    buildQuery({
      ...commonQueryParams,
      filters: 'offer.subcategoryId:"CONCERT" AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQuery({
      ...commonQueryParams,
      filters:
        'offer.subcategoryId:"FESTIVAL_MUSIQUE" AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQuery({
      ...commonQueryParams,
      filters:
        '(offer.subcategoryId:"ACHAT_INSTRUMENT" OR offer.subcategoryId:"LOCATION_INSTRUMENT") AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQuery({
      ...commonQueryParams,
      filters:
        'offer.subcategoryId:"SUPPORT_PHYSIQUE_MUSIQUE_CD" AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQuery({
      ...commonQueryParams,
      filters:
        'offer.subcategoryId:"SUPPORT_PHYSIQUE_MUSIQUE_VINYLE" AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
    buildQuery({
      ...commonQueryParams,
      userLocation: undefined,
      filters:
        '(offer.subcategoryId:"ABO_PLATEFORME_MUSIQUE" OR offer.subcategoryId:"LIVESTREAM_MUSIQUE" OR offer.subcategoryId:"TELECHARGEMENT_MUSIQUE") AND NOT offer.last30DaysBookingsRange:"very-low"',
    }),
  ]
}
