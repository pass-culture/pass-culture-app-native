import { GEOLOCATION_USER_ERROR_MESSAGE, GeolocPositionError } from './enums'
import { GeoCoordinates } from './types'

const GET_POSITION_SETTINGS = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 60000,
}

// @ts-expect-error: older versions of Safari and Firefox may use the non-standard name of `PositionError`:
// eslint-disable-next-line no-restricted-properties
const BrowserGeolocPositionError = window.GeolocationPositionError || window.PositionError

export function getWebGeolocErrorFromCode(errorCode: number): GeolocPositionError {
  // !!! Important : verify if an actual error API is available on legacy browsers.
  // Example : error API does not exist on the latest supported version of Safari on iPhone 5.
  if (BrowserGeolocPositionError) {
    // errorCode == 1
    if (errorCode === BrowserGeolocPositionError.PERMISSION_DENIED)
      return GeolocPositionError.PERMISSION_DENIED
    // errorCode == 2
    if (errorCode === BrowserGeolocPositionError.POSITION_UNAVAILABLE)
      return GeolocPositionError.POSITION_UNAVAILABLE
    // errorCode == 3
    if (errorCode === BrowserGeolocPositionError.TIMEOUT) return GeolocPositionError.TIMEOUT
  }
  return GeolocPositionError.POSITION_UNAVAILABLE
}

export const getPosition = () =>
  new Promise<GeoCoordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        })
      },
      ({ code }) => {
        const errorType = getWebGeolocErrorFromCode(code)
        switch (errorType) {
          case GeolocPositionError.PERMISSION_DENIED:
            reject(null)
            break
          case GeolocPositionError.POSITION_UNAVAILABLE:
            // Location provider not available
            reject({ type: errorType, message: GEOLOCATION_USER_ERROR_MESSAGE[errorType] })
            break
          case GeolocPositionError.TIMEOUT:
            // Location request timed out
            // TODO(unknown): we could implement a retry pattern
            reject({ type: errorType, message: GEOLOCATION_USER_ERROR_MESSAGE[errorType] })
            break
          default:
            reject(null)
            break
        }
      },
      GET_POSITION_SETTINGS
    )
  })
