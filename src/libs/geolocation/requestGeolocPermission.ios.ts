import Geolocation from 'react-native-geolocation-service'

export const requestGeolocPermission = async (onGranted: (granted: boolean) => void) => {
  const granted = await requestGeolocPermissionSystem()
  if (granted) onGranted(true)
}

export const requestGeolocPermissionSystem = async (): Promise<boolean> => {
  const permissionValue = await Geolocation.requestAuthorization('whenInUse')
  return permissionValue === 'granted'
}
