import { PermissionsAndroid } from 'react-native'

import { AskGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from '../enums'

const requestGeolocPermissionSystem: AskGeolocPermission = async () => {
  const permissions = await PermissionsAndroid.requestMultiple([
    // @ts-expect-error: because of noUncheckedIndexedAccess
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    // @ts-expect-error: because of noUncheckedIndexedAccess
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ])
  if (
    // @ts-expect-error: because of noUncheckedIndexedAccess
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' ||
    // @ts-expect-error: because of noUncheckedIndexedAccess
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'granted'
  ) {
    return GeolocPermissionState.GRANTED
  } else if (
    // @ts-expect-error: because of noUncheckedIndexedAccess
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'never_ask_again' ||
    // @ts-expect-error: because of noUncheckedIndexedAccess
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'never_ask_again'
  ) {
    return GeolocPermissionState.NEVER_ASK_AGAIN
  }
  return GeolocPermissionState.DENIED
}

export const requestGeolocPermission = requestGeolocPermissionSystem
