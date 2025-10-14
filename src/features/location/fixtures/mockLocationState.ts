import { LocationState } from 'features/location/types'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { GeolocPermissionState } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'

export const mockLocationState: LocationState = {
  hasGeolocPosition: true,
  placeQuery: 'Mocked Place',
  setPlaceQuery: jest.fn(),
  selectedPlace: null,
  setSelectedPlace: jest.fn(),
  onSetSelectedPlace: jest.fn(),
  onResetPlace: jest.fn(),
  setPlaceGlobally: jest.fn(),
  onModalHideRef: { current: jest.fn() },
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission: jest.fn(),
  aroundPlaceRadius: 1000,
  setAroundPlaceRadius: jest.fn(),
  aroundMeRadius: 5000,
  setAroundMeRadius: jest.fn(),
  selectedLocationMode: LocationMode.EVERYWHERE,
  setSelectedLocationMode: jest.fn(),
  place: null,
  showGeolocPermissionModal: jest.fn(),
  tempAroundMeRadius: DEFAULT_RADIUS,
  setTempAroundMeRadius: jest.fn(),
  tempAroundPlaceRadius: DEFAULT_RADIUS,
  setTempAroundPlaceRadius: jest.fn(),
  tempLocationMode: LocationMode.EVERYWHERE,
  setTempLocationMode: jest.fn(),
}
