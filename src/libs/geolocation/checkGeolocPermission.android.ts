import { PermissionsAndroid } from 'react-native'

import { GeolocPermissionState } from './permissionState.d'

export const checkGeolocPermission = async (): Promise<GeolocPermissionState> => {
  const permission1 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  )
  const permission2 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
  )
  if (permission1 || permission2) return GeolocPermissionState.GRANTED
  // on Android, we only have access to information actived: yes/no
  // in that case 'no', we want to display our custom modale, so we return NEVER_ASK_AGAIN
  return GeolocPermissionState.NEVER_ASK_AGAIN
}
