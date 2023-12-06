import AgonTukGeolocation, {
  GeoOptions,
  PositionError as AgonTukPositionError,
} from 'react-native-geolocation-service'

import { GEOLOCATION_USER_ERROR_MESSAGE, GeolocPositionError } from './enums'
import { GeoCoordinates } from './types'

const GET_POSITION_SETTINGS: GeoOptions = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 10000,
  showLocationDialog: false,
  forceRequestLocation: false,
}

const ERROR_MAPPING: Record<AgonTukPositionError, GeolocPositionError> = {
  [AgonTukPositionError.PERMISSION_DENIED]: GeolocPositionError.PERMISSION_DENIED,
  [AgonTukPositionError.POSITION_UNAVAILABLE]: GeolocPositionError.POSITION_UNAVAILABLE,
  [AgonTukPositionError.TIMEOUT]: GeolocPositionError.TIMEOUT,
  [AgonTukPositionError.PLAY_SERVICE_NOT_AVAILABLE]: GeolocPositionError.PLAY_SERVICE_NOT_AVAILABLE,
  [AgonTukPositionError.SETTINGS_NOT_SATISFIED]: GeolocPositionError.SETTINGS_NOT_SATISFIED,
  [AgonTukPositionError.INTERNAL_ERROR]: GeolocPositionError.INTERNAL_ERROR,
}

export const getPosition = () =>
  new Promise<GeoCoordinates>((resolve, reject) => {
    AgonTukGeolocation.getCurrentPosition(
      (position) => {
        resolve({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        })
      },
      ({ code }) => {
        const type = ERROR_MAPPING[code]
        switch (type) {
          case GeolocPositionError.PERMISSION_DENIED:
            reject(null)
            break
          case GeolocPositionError.POSITION_UNAVAILABLE:
            // Location provider not available
            // or old iPhones (5s, 6s confirmed) only : global localisation setting is off with message "Location service is turned off"
            reject({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
            break
          case GeolocPositionError.TIMEOUT:
            // Location request timed out
            // TODO(unknown): we could implement a retry pattern
            reject({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
            break
          case GeolocPositionError.PLAY_SERVICE_NOT_AVAILABLE:
            reject({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
            break
          case GeolocPositionError.SETTINGS_NOT_SATISFIED:
            // Android only : location service is disabled or location mode is not appropriate for the current request
            reject({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
            break
          case GeolocPositionError.INTERNAL_ERROR:
            /// Android only : library crashed for some reason or getCurrentActivity() returned null
            reject({ type, message: GEOLOCATION_USER_ERROR_MESSAGE[type] })
            break
          default:
            reject(null)
            break
        }
      },
      GET_POSITION_SETTINGS
    )
  })
