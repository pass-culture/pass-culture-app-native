import Geolocation from 'react-native-geolocation-service'

import { AskGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from '../enums'

const requestGeolocPermissionSystem = async () => {
  const permissionValue = await Geolocation.requestAuthorization('whenInUse')
  // Corresponding user response: Allow while using app
  if (permissionValue === 'granted') return GeolocPermissionState.GRANTED
  return GeolocPermissionState.NEVER_ASK_AGAIN
}

export const requestGeolocPermission: AskGeolocPermission = requestGeolocPermissionSystem
