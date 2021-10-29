import { GeolocPermissionState } from '../enums'
import { IGeolocationContext } from '../types'
export {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../enums'
export type { GeoCoordinates, GeolocationError, IGeolocationContext } from '../types'

export const requestGeolocPermission = jest.fn()
export const triggerPositionUpdate = jest.fn()
export const showGeolocPermissionModal = jest.fn()

const geolocationContext: IGeolocationContext = {
  position: { longitude: 90, latitude: 90 },
  positionError: null,
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission,
  triggerPositionUpdate,
  showGeolocPermissionModal,
}

export const useGeolocation = jest.fn().mockReturnValue(geolocationContext)
