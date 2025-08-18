import { PermissionsAndroid } from 'react-native'

import { AskGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from '../enums'

export const requestGeolocPermission: AskGeolocPermission = async () => {
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
  )

  switch (status) {
    case PermissionsAndroid.RESULTS.GRANTED:
      return GeolocPermissionState.GRANTED
    case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
      return GeolocPermissionState.NEVER_ASK_AGAIN
    default:
      return GeolocPermissionState.DENIED
  }
}
