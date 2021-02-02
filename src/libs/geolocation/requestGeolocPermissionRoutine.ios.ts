import Geolocation from 'react-native-geolocation-service'

export const requestGeolocPermissionRoutine = async (onGranted: (granted: boolean) => void) => {
  const granted = await requestGeolocPermission()
  if (granted) onGranted(true)
}

export const requestGeolocPermission = async (): Promise<boolean> => {
  const permissionValue = await Geolocation.requestAuthorization('whenInUse')
  return permissionValue === 'granted'
}
