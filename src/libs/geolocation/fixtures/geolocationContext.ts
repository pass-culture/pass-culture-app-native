import { GeolocPermissionState } from 'libs/geolocation'
import { IGeolocationContext } from 'libs/geolocation/GeolocationWrapper'

export const emptyGeolocationContext: IGeolocationContext = {
  position: null,
  positionError: null,
  setPosition: () => undefined,
  triggerPositionUpdate: () => undefined,
  requestGeolocPermission: () => Promise.resolve(),
  checkGeolocPermission: () => Promise.resolve(),
  permissionState: GeolocPermissionState.GRANTED,
}

export const geolocalisationContext: IGeolocationContext = {
  ...emptyGeolocationContext,
  position: {
    latitude: 90,
    longitude: 90,
    accuracy: 1,
    altitude: null,
    heading: null,
    speed: null,
    altitudeAccuracy: null,
  },
}
