import { Dispatch, SetStateAction } from 'react'

import { GEOLOCATION_USER_ERROR_MESSAGE, GeolocPositionError } from './enums'
import { GeolocationError, GeoCoordinates } from './types'

const GET_POSITION_SETTINGS = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 10000,
}

// @ts-expect-error: older versions of Safari and Firefox use the non-standard name of `PositionError`:
// eslint-disable-next-line no-restricted-properties
export const BrowserGeolocPositionError = window.GeolocationPositionError || window.PositionError

const ERROR_MAPPING: Record<string, GeolocPositionError> = {
  [BrowserGeolocPositionError.PERMISSION_DENIED]: GeolocPositionError.PERMISSION_DENIED,
  [BrowserGeolocPositionError.POSITION_UNAVAILABLE]: GeolocPositionError.POSITION_UNAVAILABLE,
  [BrowserGeolocPositionError.TIMEOUT]: GeolocPositionError.TIMEOUT,
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
    ({ code }) => {
      const type = ERROR_MAPPING[code]
      switch (type) {
        case GeolocPositionError.PERMISSION_DENIED:
          setPositionError(null)
          setPosition(null)
          break
        case GeolocPositionError.POSITION_UNAVAILABLE:
          // Location provider not available
          setPositionError({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
          break
        case GeolocPositionError.TIMEOUT:
          // Location request timed out
          // TODO: we could implement a retry pattern
          setPositionError({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
          setPosition(null)
          break
      }
    },
    GET_POSITION_SETTINGS
  )
