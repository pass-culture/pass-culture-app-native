import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'

/**
 * Request geolocation permission and sync location.
 * - If permission is granted, sync location and call onSuccess callback with no visible effect.
 * - If permission is never ask again, show permission modal.
 */
export const requestGeolocPermission = async (params: { onSuccess?: () => void } = {}) => {
  console.log('requestGeolocPermission')
  await requestOSGeolocPermission(params.onSuccess)
  // locationActions.setPermissionState(permission)
  // await syncLocation()

  // if (permission === GeolocPermissionState.GRANTED) {
  //   return params.onSuccess?.()
  // }
  // if (permission === GeolocPermissionState.NEVER_ASK_AGAIN) {
  //   navigationRef.navigate('GeolocationActivationModal')
  // }
}
