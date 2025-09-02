import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'

import {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from './geolocation/enums'
import { useLocation, LocationWrapper } from './LocationWrapper'
import { GeoCoordinates, GeolocationError, ILocationContext, Position } from './types'

export {
  useLocation,
  LocationWrapper,
  checkGeolocPermission,
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
}
export type { GeoCoordinates, GeolocationError, ILocationContext, Position }
