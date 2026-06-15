import { DEFAULT_RADIUS } from 'features/search/constants'

import { GeolocPermissionState } from '../geolocation/enums'
import { LocationMode } from '../types'
export {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../geolocation/enums'
export type {
  GeoCoordinates,
  GeolocationError,
  UseLocationReturnType as useLocationReturnType,
} from '../types'

export const requestGeolocPermission = jest.fn()
export const triggerPositionUpdate = jest.fn()
export const showGeolocPermissionModal = jest.fn()
export const onPressGeolocPermissionModalButton = jest.fn()
const setPlace = jest.fn()
const setSelectedLocationMode = jest.fn()
const onResetPlace = jest.fn()
const setSelectedPlace = jest.fn()
const setPlaceQuery = jest.fn()
const setAroundPlaceRadius = jest.fn()
const setAroundMeRadius = jest.fn()

export const useLocation = jest.fn().mockReturnValue({
  geolocPosition: { longitude: 90.4773245, latitude: 90.4773245 },
  geolocPositionError: null,
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission,
  showGeolocPermissionModal,
  onPressGeolocPermissionModalButton,
  hasGeolocPosition: true,
  place: null,
  setPlace,
  selectedLocationMode: LocationMode.AROUND_ME,
  setSelectedLocationMode,
  onResetPlace,
  selectedPlace: null,
  setSelectedPlace,
  setPlaceQuery,
  aroundPlaceRadius: DEFAULT_RADIUS,
  setAroundPlaceRadius,
  aroundMeRadius: DEFAULT_RADIUS,
  setAroundMeRadius,
  userLocation: undefined,
})
