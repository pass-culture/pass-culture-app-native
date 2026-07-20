import { navigationRef } from 'features/navigation/navigationRef'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { locationActions } from 'libs/locationV2/location.store'
import { syncLocation } from 'libs/locationV2/syncLocation'

/**
 * Request geolocation permission and sync location.
 * - If permission is granted, sync location and call onSuccess callback with no visible effect.
 * - If permission is never ask again, show permission modal.
 */
export const requestGeolocPermission = async (params: { onSuccess?: () => void } = {}) => {
  const permission = await requestOSGeolocPermission()
  locationActions.setPermissionState(permission)
  await syncLocation()

  if (permission === GeolocPermissionState.GRANTED) {
    return params.onSuccess?.()
  }
  if (permission === GeolocPermissionState.NEVER_ASK_AGAIN) {
    navigationRef.navigate('GeolocationActivationModal')
  }
}
