import { GeolocPermissionState } from 'libs/location'
import { ReadGeolocPermission } from 'libs/location/types'

// Note : `navigator.permissions` is not yet supported for Safari desktop and mobile :
// https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API#browser_compatibility
export const checkGeolocPermission: ReadGeolocPermission = async function () {
  if (navigator.permissions) {
    const { state } = await navigator.permissions.query({ name: 'geolocation' })
    if (state === 'granted') return GeolocPermissionState.GRANTED
    if (state === 'prompt') return GeolocPermissionState.DENIED
    return GeolocPermissionState.NEVER_ASK_AGAIN
  }
  return GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY
}
