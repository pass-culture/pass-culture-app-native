import { GeolocPermissionState } from './enums'

export async function checkGeolocPermission(): Promise<GeolocPermissionState> {
  const { state } = await navigator.permissions.query({ name: 'geolocation' })
  if (state === 'granted') {
    return GeolocPermissionState.GRANTED
  }
  if (state === 'denied' || state === 'prompt') {
    return GeolocPermissionState.DENIED
  }
  return GeolocPermissionState.NEVER_ASK_AGAIN
}
