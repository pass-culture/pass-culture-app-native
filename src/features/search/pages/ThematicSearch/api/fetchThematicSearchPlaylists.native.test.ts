import { buildQueryHelper } from 'features/search/pages/ThematicSearch/api/buildQueryHelper'
import { fetchThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/fetchThematicSearchPlaylists'
import * as multipleQueriesAPI from 'libs/algolia/fetchAlgolia/multipleQueries'
import { Position } from 'libs/location/location'

const mockMultipleQueries = jest.spyOn(multipleQueriesAPI, 'multipleQueries').mockResolvedValue([])

describe('fetchThematicSearchPlaylists', () => {
  it('should execute `multipleQueries` to fetch offers', async () => {
    const userLocation = { latitude: 1, longitude: 2 }
    const queriesWithUserLocation = buildQueries(userLocation)
    await fetchThematicSearchPlaylists(queriesWithUserLocation)

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, queriesWithUserLocation)
  })

  it('should execute `multipleQueries` to fetch offers even without UserLocation', async () => {
    const userLocation = undefined
    const queriesWithoutUserLocation = buildQueries(userLocation)

    await fetchThematicSearchPlaylists(queriesWithoutUserLocation)

    expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, queriesWithoutUserLocation)
  })

  it('should return empty array if there is an error with multiplqueries', async () => {
    mockMultipleQueries.mockRejectedValueOnce(new Error('Async error'))

    const userLocation = { latitude: 1, longitude: 2 }
    const queriesWithUserLocation = buildQueries(userLocation)

    const result = await fetchThematicSearchPlaylists(queriesWithUserLocation)

    expect(result).toStrictEqual([])
  })
})

function buildQueries(userLocation: Position) {
  const commonQueryParams = {
    indexName: 'algoliaOffersIndexNameB',
    userLocation,
    hitsPerPage: 20,
  }

  return [
    buildQueryHelper({
      ...commonQueryParams,
      filters: 'offer.subcategoryId:"SEANCE_CINE"',
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: 'offer.subcategoryId:"VOD"',
    }),
    buildQueryHelper({
      ...commonQueryParams,
      filters: 'offer.subcategoryId:"CONCERT" AND NOT offer.last30DaysBookingsRange:"low"',
    }),
  ]
}
