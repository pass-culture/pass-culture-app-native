import { GeolocPermissionState } from '../enums'
import { ILocationContext } from '../types'
export {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../enums'
export type { GeoCoordinates, GeolocationError, ILocationContext } from '../types'

export const requestGeolocPermission = jest.fn()
export const triggerPositionUpdate = jest.fn()
export const showGeolocPermissionModal = jest.fn()
export const onPressGeolocPermissionModalButton = jest.fn()
export const setCustomPosition = jest.fn()
const initialize = jest.fn()
const isCurrentLocationMode = jest.fn().mockReturnValue(true)
const runGeolocationDialogs = jest.fn()
const saveAllPositionChanges = jest.fn()
const setPlace = jest.fn()
const setSelectedOption = jest.fn()

const locationContext: ILocationContext = {
  userPosition: { longitude: 90, latitude: 90 },
  userPositionError: null,
  customPosition: null,
  setCustomPosition,
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission,
  triggerPositionUpdate,
  showGeolocPermissionModal,
  onPressGeolocPermissionModalButton,
  getLocationTitle: () => 'Ma position',
  initialize,
  isCurrentLocationMode,
  isGeolocated: true,
  hasNoSelectedPlace: false,
  runGeolocationDialogs,
  saveAllPositionChanges,
  onModalHideRef: { current: undefined },
  setPlace,
  setSelectedOption,
}

export const useLocation = jest.fn().mockReturnValue(locationContext)
