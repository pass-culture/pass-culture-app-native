import { navigationRef } from 'features/navigation/navigationRef'
import { locationActions } from 'libs/locationV2/location.store'

import {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../enums'

export const requestGeolocPermission = async (onSuccess?: () => void) => {
  locationActions.setGeolocationError(null)

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      locationActions.setGeolocPosition(position.coords)
      onSuccess?.()
    },
    async ({ code }) => {
      switch (code) {
        case window.GeolocationPositionError.PERMISSION_DENIED:
          locationActions.setPermissionState(GeolocPermissionState.DENIED)
          setError(GeolocPositionError.PERMISSION_DENIED)
          if ((await navigator.permissions.query({ name: 'geolocation' })).state === 'denied') {
            navigationRef.navigate('GeolocationActivationModal')
          }
          break
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          setError(GeolocPositionError.POSITION_UNAVAILABLE)
          break
        case GeolocationPositionError.TIMEOUT:
          setError(GeolocPositionError.TIMEOUT)
          break
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 600000,
    }
  )
}

const setError = (type: GeolocPositionError) =>
  locationActions.setGeolocationError({
    type,
    message: GEOLOCATION_USER_ERROR_MESSAGE[type],
  })
