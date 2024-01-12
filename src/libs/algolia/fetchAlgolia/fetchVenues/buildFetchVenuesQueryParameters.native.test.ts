import { VenuesFacets } from 'libs/algolia/enums'
import { buildFetchVenuesQueryParameters } from 'libs/algolia/fetchAlgolia/fetchVenues/buildFetchVenuesQueryParameters'
import { AlgoliaQueryParameters, FetchVenuesParameters, LocationMode } from 'libs/algolia/types'

const facetFilters = [[`${VenuesFacets.has_at_least_one_bookable_offer}:true`]]
const defaultBuildLocationParameterParams = {
  userLocation: undefined,
  selectedLocationMode: LocationMode.EVERYWHERE,
  aroundMeRadius: 50,
  aroundPlaceRadius: 50,
}

describe('buildFetchVenuesQueryParameters', () => {
  it.each`
    params | expected
    ${{ query: 'myQuery', buildLocationParameterParams: defaultBuildLocationParameterParams }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [], facetFilters },
}}
    ${{ query: '', buildLocationParameterParams: defaultBuildLocationParameterParams }} | ${{
  query: '',
  requestOptions: { attributesToHighlight: [], facetFilters },
}}
    ${{ query: 'myQuery', attributesToHighlight: undefined, buildLocationParameterParams: defaultBuildLocationParameterParams }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [], facetFilters },
}}
    ${{ query: 'myQuery', attributesToHighlight: ['myAttibuts1', 'myAttibuts2'], buildLocationParameterParams: defaultBuildLocationParameterParams }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: ['myAttibuts1', 'myAttibuts2'], facetFilters },
}}
    ${{ query: 'myQuery', buildLocationParameterParams: {
    userLocation: { latitude: 48.90374, longitude: 2.48171 },
    selectedLocationMode: LocationMode.AROUND_PLACE,
    aroundMeRadius: 50,
    aroundPlaceRadius: 50,
  } }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [], facetFilters, aroundLatLng: '48.90374, 2.48171', aroundRadius: 50000 },
}}
    ${{ query: 'myQuery', buildLocationParameterParams: {
    userLocation: { latitude: 48.90374, longitude: 2.48171 },
    selectedLocationMode: LocationMode.AROUND_ME,
    aroundMeRadius: 50,
    aroundPlaceRadius: 50,
  } }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [], facetFilters, aroundLatLng: '48.90374, 2.48171', aroundRadius: 50000 },
}}
    ${{ query: 'myQuery', buildLocationParameterParams: {
    userLocation: { latitude: 48.90374, longitude: 2.48171 },
    selectedLocationMode: LocationMode.EVERYWHERE,
    aroundMeRadius: 50,
    aroundPlaceRadius: 50,
  } }} | ${{
  query: 'myQuery',
  requestOptions: { attributesToHighlight: [], facetFilters, aroundLatLng: '48.90374, 2.48171', aroundRadius: 'all' },
}}
  `(
    'should correcty format FetchVenues parameters : $params',
    ({ params, expected }: { params: FetchVenuesParameters; expected: AlgoliaQueryParameters }) => {
      const result = buildFetchVenuesQueryParameters(params)

      expect(result).toEqual(expected)
    }
  )
})
