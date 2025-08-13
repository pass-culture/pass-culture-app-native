import { PermissionsAndroid } from 'react-native'
import { check, PERMISSIONS } from 'react-native-permissions'

import { ReadGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from '../enums'

export const checkGeolocPermission: ReadGeolocPermission = async () => {
  const status = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
  return status === PermissionsAndroid.RESULTS.GRANTED
    ? GeolocPermissionState.GRANTED
    : GeolocPermissionState.NEVER_ASK_AGAIN
}
