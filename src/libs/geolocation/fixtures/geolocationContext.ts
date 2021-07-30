import { GeolocPermissionState, IGeolocationContext } from 'libs/geolocation'

export const emptyGeolocationContext: IGeolocationContext = {
  position: null,
  positionError: null,
  triggerPositionUpdate: () => undefined,
  requestGeolocPermission: () => Promise.resolve(),
  permissionState: GeolocPermissionState.GRANTED,
}

export const geolocalisationContext: IGeolocationContext = {
  ...emptyGeolocationContext,
  position: {
    latitude: 90,
    longitude: 90,
  },
}
