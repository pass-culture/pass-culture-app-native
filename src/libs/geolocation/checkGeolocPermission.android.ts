import { PermissionsAndroid } from 'react-native'

export const checkGeolocPermission = async (): Promise<boolean> => {
  const permission1 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  )
  const permission2 = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
  )
  return permission1 || permission2
}
