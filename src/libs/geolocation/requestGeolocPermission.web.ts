import { GeolocPermissionState } from './enums'

// Note : `navigator.permissions` is not yet supported for Safari desktop and mobile :
// https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API#browser_compatibility
export async function requestGeolocPermission(): Promise<GeolocPermissionState> {
  if (navigator.permissions) {
    const { state } = await navigator.permissions.query({ name: 'geolocation' })
    if (state === 'granted') {
      return GeolocPermissionState.GRANTED
    }
    if (state === 'denied') {
      return GeolocPermissionState.NEVER_ASK_AGAIN
    }
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(GeolocPermissionState.GRANTED),
      () => resolve(GeolocPermissionState.NEVER_ASK_AGAIN)
    )
  })
}
