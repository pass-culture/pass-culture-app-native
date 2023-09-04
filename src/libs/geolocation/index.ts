import { checkGeolocPermission } from './checkGeolocPermission'
import { GEOLOCATION_USER_ERROR_MESSAGE, GeolocPermissionState, GeolocPositionError } from './enums'
import { useLocation, LocationWrapper } from './LocationWrapper'
import { requestGeolocPermission } from './requestGeolocPermission'
import { GeoCoordinates, GeolocationError, ILocationContext, Position } from './types'

export {
  useLocation,
  LocationWrapper,
  requestGeolocPermission,
  checkGeolocPermission,
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
}
export type { GeoCoordinates, GeolocationError, ILocationContext, Position }
