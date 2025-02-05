import {
  AlgoliaPositionParams,
  buildLocationParameter,
  buildLocationParameterForSearch,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { LocationMode } from 'libs/location/types'

const DEFAULT_USER_POSITION = { latitude: 48, longitude: -1 }
const EXPECTED_AROUND_LAT_LNG = `${48}, ${-1}`

describe('buildLocationParameters', () => {
  it.each`
    selectedLocationMode         | userLocation             | aroundMeRadius | aroundPlaceRadius | expected
    ${LocationMode.AROUND_ME}    | ${DEFAULT_USER_POSITION} | ${20}          | ${'all'}          | ${{ aroundLatLng: EXPECTED_AROUND_LAT_LNG, aroundRadius: 20_000 }}
    ${LocationMode.AROUND_ME}    | ${DEFAULT_USER_POSITION} | ${'all'}       | ${10}             | ${{ aroundLatLng: EXPECTED_AROUND_LAT_LNG, aroundRadius: 'all' }}
    ${LocationMode.AROUND_PLACE} | ${DEFAULT_USER_POSITION} | ${'all'}       | ${10}             | ${{ aroundLatLng: EXPECTED_AROUND_LAT_LNG, aroundRadius: 10_000 }}
    ${LocationMode.AROUND_PLACE} | ${DEFAULT_USER_POSITION} | ${20}          | ${'all'}          | ${{ aroundLatLng: EXPECTED_AROUND_LAT_LNG, aroundRadius: 'all' }}
    ${LocationMode.EVERYWHERE}   | ${undefined}             | ${'all'}       | ${'all'}          | ${undefined}
  `(
    'when selectedLocation is $selectedLocationMode, userLocation is $userLocation, aroundMeRadius is $aroundMeRadius, aroundPlaceRadius is $aroundPlaceRadius',
    ({ selectedLocationMode, userLocation, aroundMeRadius, aroundPlaceRadius, expected }) => {
      const result: AlgoliaPositionParams | undefined = buildLocationParameter({
        selectedLocationMode,
        userLocation,
        aroundMeRadius,
        aroundPlaceRadius,
      })

      expect(result).toEqual(expected)
    }
  )
})

describe('buildLocationParametersForSearch', () => {
  it.each`
    selectedLocationMode       | geolocPosition           | userLocation | aroundMeRadius | aroundPlaceRadius | expected
    ${LocationMode.EVERYWHERE} | ${DEFAULT_USER_POSITION} | ${undefined} | ${'all'}       | ${'all'}          | ${{ aroundLatLng: EXPECTED_AROUND_LAT_LNG, aroundRadius: 'all' }}
    ${LocationMode.EVERYWHERE} | ${undefined}             | ${undefined} | ${'all'}       | ${'all'}          | ${undefined}
  `(
    'when selectedLocation is $selectedLocationMode,geolocPosition is $geolocPosition, userLocation is $userLocation, aroundMeRadius is $aroundMeRadius, aroundPlaceRadius is $aroundPlaceRadius',
    ({
      selectedLocationMode,
      userLocation,
      aroundMeRadius,
      aroundPlaceRadius,
      expected,
      geolocPosition,
    }) => {
      const result: AlgoliaPositionParams | undefined = buildLocationParameterForSearch({
        selectedLocationMode,
        userLocation,
        aroundMeRadius,
        aroundPlaceRadius,
        geolocPosition,
      })

      expect(result).toEqual(expected)
    }
  )
})
