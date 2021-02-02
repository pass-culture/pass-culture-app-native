import { PermissionsAndroid } from 'react-native'

export const requestGeolocPermission = async (onGranted: (granted: boolean) => void) => {
  const granted = await requestGeolocPermissionSystem()
  if (granted) onGranted(true)
}

export const requestGeolocPermissionSystem = async (): Promise<boolean> => {
  const permissions = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ])
  if (
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' ||
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'granted'
  ) {
    return true
  }
  return false
}
