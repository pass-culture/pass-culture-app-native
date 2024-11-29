import { OffersPlaylistParameters } from 'features/home/types'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { buildOffersModulesQueries } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOffersModulesQueries'
import { searchQueryParametersFixture } from 'libs/algolia/fixtures/searchQueryParametersFixture'
import { LocationMode } from 'libs/algolia/types'

describe('buildOffersModulesQueries', () => {
  const userLocation = {
    latitude: 48.8566,
    longitude: 2.3522,
  }
  const buildLocationParameterParams: BuildLocationParameterParams = {
    userLocation,
    selectedLocationMode: LocationMode.AROUND_ME,
    aroundMeRadius: 'all',
    aroundPlaceRadius: 'all',
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
    const parameters = {
      ...searchQueryParametersFixture,
    }

    const paramsListElement = {
      offerParams: parameters,
      locationParams: buildLocationParameterParams,
    }

    const paramsList: OffersPlaylistParameters[] = [
      [paramsListElement, paramsListElement],
      [paramsListElement],
    ]

    const queries = buildOffersModulesQueries({
      paramsList,
      isUserUnderage,
    })

    expect(queries).toEqual([expectedResult, expectedResult, expectedResult])
  })
})
