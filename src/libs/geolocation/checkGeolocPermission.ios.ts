import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'

import { ReadGeolocPermission } from 'libs/geolocation/types'

import { GeolocPermissionState } from './enums'

export const checkGeolocPermission: ReadGeolocPermission = async () => {
  const locationPermissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
  switch (locationPermissionResult) {
    case RESULTS.GRANTED:
      return GeolocPermissionState.GRANTED
    case RESULTS.DENIED:
      return GeolocPermissionState.DENIED
    case RESULTS.BLOCKED:
      return GeolocPermissionState.NEVER_ASK_AGAIN
    // if we do not know geoloc permission,
    // we want to display our custom geoloc modale to bring user to app settings
    default:
      return GeolocPermissionState.NEVER_ASK_AGAIN
  }
}
