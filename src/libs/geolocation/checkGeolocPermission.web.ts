import { GeolocPermissionState } from './permissionState.d'

// TODO: web integration
export const checkGeolocPermission = async (): Promise<GeolocPermissionState> => {
  const locationPermissionResult = null
  switch (locationPermissionResult) {
    // if we do not know geoloc permission,
    // we want to display our custom geoloc modale to bring user to app settings
    default:
      return GeolocPermissionState.NEVER_ASK_AGAIN
  }
}
