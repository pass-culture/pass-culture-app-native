import { geolocalisationContext } from '../fixtures/geolocationContext'

export {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../enums'
export type { GeoCoordinates, GeolocationError, IGeolocationContext } from '../types'

export const useGeolocation = jest.fn(() => geolocalisationContext)
