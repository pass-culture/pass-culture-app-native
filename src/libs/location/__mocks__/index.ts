import { DEFAULT_RADIUS } from 'features/search/constants'

import { GeolocPermissionState } from '../geolocation/enums'
import { ILocationContext, LocationMode } from '../types'
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
const setSelectedLocationMode = jest.fn()
const onResetPlace = jest.fn()
const onSetSelectedPlace = jest.fn()
const setSelectedPlace = jest.fn()
const setPlaceQuery = jest.fn()
const setAroundPlaceRadius = jest.fn()
const setAroundMeRadius = jest.fn()

const locationContext: ILocationContext = {
  geolocPosition: { longitude: 90.4773245, latitude: 90.4773245 },
  geolocPositionError: null,
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission,
  triggerPositionUpdate,
  showGeolocPermissionModal,
  onPressGeolocPermissionModalButton,
  hasGeolocPosition: true,
  onModalHideRef: { current: undefined },
  place: null,
  setPlace,
  selectedLocationMode: LocationMode.AROUND_ME,
  setSelectedLocationMode,
  onResetPlace,
  onSetSelectedPlace,
  selectedPlace: null,
  setSelectedPlace,
  placeQuery: '',
  setPlaceQuery,
  aroundPlaceRadius: DEFAULT_RADIUS,
  setAroundPlaceRadius,
  aroundMeRadius: DEFAULT_RADIUS,
  setAroundMeRadius,
}

export const useLocation = jest.fn().mockReturnValue(locationContext)
