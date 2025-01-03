import { PermissionsAndroid } from 'react-native'

import { AskGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from '../enums'

const ACCESS_FINE_LOCATION = 'android.permission.ACCESS_FINE_LOCATION'
const ACCESS_COARSE_LOCATION = 'android.permission.ACCESS_COARSE_LOCATION'

const requestGeolocPermissionSystem: AskGeolocPermission = async () => {
  const permissions = await PermissionsAndroid.requestMultiple([
    ACCESS_FINE_LOCATION,
    ACCESS_COARSE_LOCATION,
  ])
  if (
    permissions[ACCESS_FINE_LOCATION] === 'granted' ||
    permissions[ACCESS_COARSE_LOCATION] === 'granted'
  ) {
    return GeolocPermissionState.GRANTED
  } else if (
    permissions[ACCESS_FINE_LOCATION] === 'never_ask_again' ||
    permissions[ACCESS_COARSE_LOCATION] === 'never_ask_again'
  ) {
    return GeolocPermissionState.NEVER_ASK_AGAIN
  }
  return GeolocPermissionState.DENIED
}

export const requestGeolocPermission = requestGeolocPermissionSystem
