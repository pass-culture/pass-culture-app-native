import { GeolocPermissionState } from './enums'

export async function requestGeolocPermission(): Promise<GeolocPermissionState> {
  const { state } = await navigator.permissions.query({ name: 'geolocation' })
  if (state === 'granted') {
    return GeolocPermissionState.GRANTED
  }
  if (state === 'denied') {
    return GeolocPermissionState.NEVER_ASK_AGAIN
  }
  if (state === 'prompt') {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(GeolocPermissionState.GRANTED),
        () => resolve(GeolocPermissionState.NEVER_ASK_AGAIN)
      )
    })
  }
  return GeolocPermissionState.NEVER_ASK_AGAIN
}
