import { checkMultiple, PERMISSIONS } from 'react-native-permissions'

import { GeolocPermissionState } from './permissionState.d'

export const checkGeolocPermission = async (): Promise<GeolocPermissionState> => {
  const permissions = await checkMultiple([
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ])
  const finePermission = permissions[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
  const coarsePermission = permissions[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]
  if (finePermission === 'granted' || coarsePermission === 'granted')
    return GeolocPermissionState.GRANTED
  // on Android, we only have access to information actived: yes/no
  // in that case 'no', we want to display our custom modale, so we return NEVER_ASK_AGAIN
  return GeolocPermissionState.NEVER_ASK_AGAIN
}
