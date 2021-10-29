import { GeolocPermissionState } from '../enums'
import { ReadGeolocPermission } from '../types'

export const checkGeolocPermission: ReadGeolocPermission = jest
  .fn()
  .mockReturnValue(GeolocPermissionState.GRANTED)
