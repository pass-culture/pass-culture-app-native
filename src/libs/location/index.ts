import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'

import {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from './geolocation/enums'
import { requestGeolocPermission } from './geolocation/requestGeolocPermission/requestGeolocPermission'
import { useLocation, LocationWrapper } from './LocationWrapper'
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
