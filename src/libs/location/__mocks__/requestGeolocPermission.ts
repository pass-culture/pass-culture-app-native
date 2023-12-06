import { GeolocPermissionState } from '../enums'
import { AskGeolocPermission } from '../types'

export const requestGeolocPermission: AskGeolocPermission = jest
  .fn()
  .mockReturnValue(GeolocPermissionState.GRANTED)
