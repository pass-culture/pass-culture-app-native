import { SearchParamsObject } from 'algoliasearch/lite'

import { Activity } from 'api/gen'
import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'
import { AlgoliaQueryParameters, FetchVenuesParameters, LocationMode } from 'libs/algolia/types'

const defaultFacetFilters = [
  [`${VENUES_FACETS_ENUM.HAS_AT_LEAST_ONE_BOOKABLE_OFFER}:true`],
  [`${VENUES_FACETS_ENUM.VENUE_IS_OPEN_TO_PUBLIC}:true`],
]

interface LocationParams extends Omit<BuildLocationParameterParams, 'userLocation'> {
  userLocation?: BuildLocationParameterParams['userLocation']
}

const defaultLocationParams: LocationParams = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  aroundMeRadius: 50,
  aroundPlaceRadius: 50,
}

const buildParams = (
  query: string,
  attributesToHighlight: string[] = [],
  locationParams: LocationParams = defaultLocationParams,
  options?: SearchParamsObject
): FetchVenuesParameters => ({
  query,
  buildLocationParameterParams: locationParams as BuildLocationParameterParams,
  attributesToHighlight,
  options,
})

const buildExpected = (
  query: string,
  attributesToHighlight: string[] = [],
  aroundLatLng?: string,
  aroundRadius?: number | 'all',
  facetFilters?: string[][]
): AlgoliaQueryParameters => ({
  query,
  requestOptions: {
    attributesToHighlight,
    facetFilters: facetFilters ? [...defaultFacetFilters, ...facetFilters] : defaultFacetFilters,
    ...(aroundLatLng ? { aroundLatLng, aroundRadius: aroundRadius ?? 'all' } : {}),
  },
})

describe('buildFetchVenuesQueryParameters', () => {
  it('should handle query with default location params', () => {
    const params = buildParams('myQuery')
    const expected = buildExpected('myQuery')

    expect(buildFetchVenuesQueryParameters(params)).toEqual(expected)
  })

  it('should handle empty query with default location params', () => {
    const params = buildParams('')
    const expected = buildExpected('')

    expect(buildFetchVenuesQueryParameters(params)).toEqual(expected)
  })

  it('should handle custom attributes to highlight', () => {
    const attributes = ['myAttribute1', 'myAttribute2']
    const params = buildParams('myQuery', attributes)
    const expected = buildExpected('myQuery', attributes)

    expect(buildFetchVenuesQueryParameters(params)).toEqual(expected)
  })

  it('should handle location mode AROUND_PLACE', () => {
    const locationParams = {
      userLocation: { latitude: 48.90374, longitude: 2.48171 },
      selectedLocationMode: LocationMode.AROUND_PLACE,
      aroundMeRadius: 50,
      aroundPlaceRadius: 50,
    }
    const params = buildParams('myQuery', [], locationParams)
    const expected = buildExpected('myQuery', [], '48.90374, 2.48171', 50000)

    expect(buildFetchVenuesQueryParameters(params)).toEqual(expected)
  })

  it('should handle location mode AROUND_ME', () => {
    const locationParams = {
      userLocation: { latitude: 48.90374, longitude: 2.48171 },
      selectedLocationMode: LocationMode.AROUND_ME,
      aroundMeRadius: 50,
      aroundPlaceRadius: 50,
    }
    const params = buildParams('myQuery', [], locationParams)
    const expected = buildExpected('myQuery', [], '48.90374, 2.48171', 50000)

    expect(buildFetchVenuesQueryParameters(params)).toEqual(expected)
  })

  it('should handle location mode EVERYWHERE', () => {
    const locationParams = {
      userLocation: { latitude: 48.90374, longitude: 2.48171 },
      selectedLocationMode: LocationMode.EVERYWHERE,
      aroundMeRadius: 50,
      aroundPlaceRadius: 50,
    }
    const params = buildParams('myQuery', [], locationParams)
    const expected = buildExpected('myQuery', [], '48.90374, 2.48171', 'all')

    expect(buildFetchVenuesQueryParameters(params)).toEqual(expected)
  })

  it('should handle query with more than default facet filters', () => {
    const params = buildParams('myQuery', [], defaultLocationParams, {
      facetFilters: [[`activity:${Activity.PERFORMANCE_HALL}`]],
    })
    const expected = buildExpected('myQuery', [], '', 'all', [['activity:PERFORMANCE_HALL']])

    expect(buildFetchVenuesQueryParameters(params)).toEqual(expected)
  })
})
