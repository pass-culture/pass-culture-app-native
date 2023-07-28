import algoliasearch from 'algoliasearch'

import { fetchOffersAndVenues } from 'libs/algolia/fetchAlgolia/fetchOffersAndVenues/fetchOffersAndVenues'
import { SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment'

jest.mock('algoliasearch')

const mockMultipleQueries = algoliasearch('', '').multipleQueries

describe('fetchOffersAndVenues', () => {
  it('should execute multi query with default index', () => {
    const query = 'searched query'

    fetchOffersAndVenues({
      parameters: { query } as SearchQueryParameters,
      userLocation: null,
      isUserUnderage: false,
    })

    const expectedResult = [
      {
        indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
        params: {
          attributesToHighlight: [],
          attributesToRetrieve: [
            'offer.dates',
            'offer.isDigital',
            'offer.isDuo',
            'offer.isEducational',
            'offer.name',
            'offer.prices',
            'offer.subcategoryId',
            'offer.thumbUrl',
            'objectID',
            '_geoloc',
            'venue',
          ],
          clickAnalytics: true,
          facetFilters: [['offer.isEducational:false']],
          numericFilters: [['offer.prices: 0 TO 300']],
          page: 0,
        },
        query: 'searched query',
      },
      {
        indexName: env.ALGOLIA_VENUES_INDEX_NAME,
        params: { aroundRadius: 'all', clickAnalytics: true, hitsPerPage: 35, page: 0 },
        query: 'searched query',
      },
    ]

    expect(mockMultipleQueries).toHaveBeenCalledWith(expectedResult)
  })
})
