import { GeolocPermissionState, IGeolocationContext } from 'libs/geolocation'

export const emptyGeolocationContext: IGeolocationContext = {
  position: null,
  positionError: null,
  permissionState: GeolocPermissionState.GRANTED,
  requestGeolocPermission: () => Promise.resolve(),
  triggerPositionUpdate: () => undefined,
  showGeolocPermissionModal: () => undefined,
}

export const geolocalisationContext: IGeolocationContext = {
  ...emptyGeolocationContext,
  position: {
    latitude: 90,
    longitude: 90,
  },
}
