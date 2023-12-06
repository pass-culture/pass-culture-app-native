import { GeolocPermissionState } from 'libs/location/__mocks__'
import { AskGeolocPermission } from 'libs/location/types'

export const requestGeolocPermission: AskGeolocPermission = jest
  .fn()
  .mockReturnValue(GeolocPermissionState.GRANTED)
