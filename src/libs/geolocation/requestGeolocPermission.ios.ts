import Geolocation from 'react-native-geolocation-service'

import { GeolocPermissionState } from './permissionState.d'

export const requestGeolocPermissionSystem = async (): Promise<GeolocPermissionState> => {
  const permissionValue = await Geolocation.requestAuthorization('whenInUse')
  // Corresponding user response: Allow while using app
  if (permissionValue === 'granted') return GeolocPermissionState.GRANTED
  // Corresponding user response: Allow once
  if (permissionValue === 'denied') return GeolocPermissionState.DENIED
  // Corresponding user response: Never
  return GeolocPermissionState.NEVER_ASK_AGAIN
}

export const requestGeolocPermission = requestGeolocPermissionSystem
