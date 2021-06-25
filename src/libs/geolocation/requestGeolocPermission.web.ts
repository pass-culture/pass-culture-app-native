import { GeolocPermissionState } from './permissionState.d'

export const requestGeolocPermissionSystem = async (): Promise<GeolocPermissionState> => {
  return GeolocPermissionState.NEVER_ASK_AGAIN
}

export const requestGeolocPermission = requestGeolocPermissionSystem
