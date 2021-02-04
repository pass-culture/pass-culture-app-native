import Geolocation from 'react-native-geolocation-service'

export const requestGeolocPermissionSystem = async (): Promise<boolean> => {
  const permissionValue = await Geolocation.requestAuthorization('whenInUse')
  return permissionValue === 'granted'
}

export const requestGeolocPermission = requestGeolocPermissionSystem
