import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'

import { ReadGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from './enums'

export const checkGeolocPermission: ReadGeolocPermission = async () => {
  const locationPermissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
  switch (locationPermissionResult) {
    case RESULTS.GRANTED:
      return GeolocPermissionState.GRANTED
    case RESULTS.DENIED:
      return GeolocPermissionState.DENIED
    default:
      return GeolocPermissionState.NEVER_ASK_AGAIN
  }
}
