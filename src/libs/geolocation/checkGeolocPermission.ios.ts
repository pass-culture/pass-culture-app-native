import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'

export const checkGeolocPermission = async (): Promise<boolean> => {
  const locationPermissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
  return locationPermissionResult === RESULTS.GRANTED
}
