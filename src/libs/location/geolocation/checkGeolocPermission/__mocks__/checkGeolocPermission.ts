import { GeolocPermissionState } from 'libs/location/__mocks__'
import { ReadGeolocPermission } from 'libs/location/types'

export const checkGeolocPermission: ReadGeolocPermission = jest
  .fn()
  .mockReturnValue(GeolocPermissionState.GRANTED)
