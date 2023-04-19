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
export const onPressGeolocPermissionModalButton = jest.fn()
export const setCustomPosition = jest.fn()

const geolocationContext: IGeolocationContext = {
  userPosition: { longitude: 90, latitude: 90 },
  userPositionError: null,
  customPosition: null,
  setCustomPosition,
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission,
  triggerPositionUpdate,
  showGeolocPermissionModal,
  onPressGeolocPermissionModalButton,
}

export const useGeolocation = jest.fn().mockReturnValue(geolocationContext)
