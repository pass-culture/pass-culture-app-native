import { Dispatch, SetStateAction } from 'react'

import { MonitoringError } from 'libs/monitoring'

import { GEOLOCATION_USER_ERROR_MESSAGE, GeolocPositionError } from './enums'
import { GeolocationError, GeoCoordinates } from './types'

const GET_POSITION_SETTINGS = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 10000,
}

const ERROR_MAPPING: Record<string, GeolocPositionError> = {
  [GeolocationPositionError.PERMISSION_DENIED]: GeolocPositionError.PERMISSION_DENIED,
  [GeolocationPositionError.POSITION_UNAVAILABLE]: GeolocPositionError.POSITION_UNAVAILABLE,
  [GeolocationPositionError.TIMEOUT]: GeolocPositionError.TIMEOUT,
}

export const getPosition = (
  setPosition: Dispatch<SetStateAction<GeoCoordinates | null>>,
  setPositionError: Dispatch<SetStateAction<GeolocationError | null>>
): void =>
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setPositionError(null)
      setPosition({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      })
    },
    ({ code, message }) => {
      const type = ERROR_MAPPING[code]
      switch (type) {
        case GeolocPositionError.PERMISSION_DENIED:
          setPositionError(null)
          setPosition(null)
          break
        case GeolocPositionError.POSITION_UNAVAILABLE:
          // Location provider not available
          setPositionError({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
          new MonitoringError(message, 'PositionError_PositionUnavailable')
          break
        case GeolocPositionError.TIMEOUT:
          // Location request timed out
          // TODO: we could implement a retry pattern
          setPositionError({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
          setPosition(null)
          new MonitoringError(message, 'PositionError_Timeout')
          break
      }
    },
    GET_POSITION_SETTINGS
  )
