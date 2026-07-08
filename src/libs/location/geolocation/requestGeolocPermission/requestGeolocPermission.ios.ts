import Geolocation from 'react-native-geolocation-service'

import { navigationRef } from 'features/navigation/navigationRef'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { locationActions } from 'libs/locationV2/location.store'

import {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../enums'

export const requestGeolocPermission = async (onSuccess?: () => void) => {
  console.log('requestGeolocPermission ios')
  const permissionValue = await Geolocation.requestAuthorization('whenInUse')
  console.log('permissionValue', permissionValue)
  if (permissionValue === 'granted') {
    locationActions.setPermissionState(GeolocPermissionState.GRANTED)
    console.log('granted')
    try {
      const position = await getGeolocPosition()
      locationActions.setGeolocPosition(position)
      console.log({ position })
      onSuccess?.()
    } catch (error) {
      locationActions.setGeolocationError({
        type: GeolocPositionError.POSITION_UNAVAILABLE,
        message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.POSITION_UNAVAILABLE],
      })
    }
    return
  }
  locationActions.setPermissionState(GeolocPermissionState.NEVER_ASK_AGAIN)
  navigationRef.navigate('GeolocationActivationModal')
}
