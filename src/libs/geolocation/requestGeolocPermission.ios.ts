import Geolocation from 'react-native-geolocation-service'

import { GeolocPermissionState } from './permissionState.d'

export const requestGeolocPermissionSystem = async (): Promise<GeolocPermissionState> => {
  const permissionValue = await Geolocation.requestAuthorization('whenInUse')
  // Corresponding user response: Allow while using app
  if (permissionValue === 'granted') return GeolocPermissionState.GRANTED
  return GeolocPermissionState.NEVER_ASK_AGAIN
}

export const requestGeolocPermission = requestGeolocPermissionSystem
