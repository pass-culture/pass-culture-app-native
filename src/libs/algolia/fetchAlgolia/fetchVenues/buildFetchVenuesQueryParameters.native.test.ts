import { AlgoliaQueryParameters, FetchVenuesParameters, LocationMode } from 'libs/algolia'
import { VenuesFacets } from 'libs/algolia/enums'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'

const facetFilters = [[`${VenuesFacets.has_at_least_one_bookable_offer}:true`]]

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
  locationParams: LocationParams = defaultLocationParams
): FetchVenuesParameters => ({
  query,
  buildLocationParameterParams: locationParams as BuildLocationParameterParams,
  attributesToHighlight,
})

const buildExpected = (
  query: string,
  attributesToHighlight: string[] = [],
  aroundLatLng?: string,
  aroundRadius?: number | 'all'
): AlgoliaQueryParameters => ({
  query,
  requestOptions: {
    attributesToHighlight,
    facetFilters,
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
})
