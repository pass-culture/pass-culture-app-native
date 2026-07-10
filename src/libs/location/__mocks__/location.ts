export {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../geolocation/enums'
export type { GeoCoordinates, GeolocationError } from '../types'

export const requestGeolocPermission = jest.fn()
export const triggerPositionUpdate = jest.fn()
export const showGeolocPermissionModal = jest.fn()
