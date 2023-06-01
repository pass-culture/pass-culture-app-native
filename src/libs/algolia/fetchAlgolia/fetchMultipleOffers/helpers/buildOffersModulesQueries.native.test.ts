import { initialSearchState } from 'features/search/context/reducer'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { buildOffersModulesQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOffersModulesQueries'

describe('buildOffersModulesQueries', () => {
  const userLocation = {
    latitude: 48.8566,
    longitude: 2.3522,
  }

  const isUserUnderage = false

  const expectedResult = {
    indexName: 'algoliaOffersIndexName',
    params: {
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 'all',
      facetFilters: [['offer.isEducational:false']],
      numericFilters: [['offer.prices: 0 TO 300']],
      hitsPerPage: 20,
      attributesToHighlight: [],
      attributesToRetrieve: offerAttributesToRetrieve,
    },
    query: '',
  }

  it('should return a list of offers queries', () => {
    const searchState = {
      ...initialSearchState,
    }

    const paramsList = [[searchState, searchState], [searchState]]

    const queries = buildOffersModulesQueries({ paramsList, userLocation, isUserUnderage })

    expect(queries).toEqual([expectedResult, expectedResult, expectedResult])
  })
})
