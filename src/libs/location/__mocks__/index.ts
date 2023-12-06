import { GeolocPermissionState } from '../geolocation/enums'
import { ILocationContext } from '../types'
export {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../geolocation/enums'
export type { GeoCoordinates, GeolocationError, ILocationContext } from '../types'

export const requestGeolocPermission = jest.fn()
export const triggerPositionUpdate = jest.fn()
export const showGeolocPermissionModal = jest.fn()
export const onPressGeolocPermissionModalButton = jest.fn()
export const setCustomPosition = jest.fn()
const setPlace = jest.fn()

const locationContext: ILocationContext = {
  userPosition: { longitude: 90.4773245, latitude: 90.4773245 },
  userPositionError: null,
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission,
  triggerPositionUpdate,
  showGeolocPermissionModal,
  onPressGeolocPermissionModalButton,
  isGeolocated: true,
  onModalHideRef: { current: undefined },
  place: null,
  setPlace,
}

export const useLocation = jest.fn().mockReturnValue(locationContext)
