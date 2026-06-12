import { AskGeolocPermission } from '../../types'
import { GeolocPermissionState } from '../enums'

export const requestGeolocPermission: AskGeolocPermission = async () => {
  const { state } = await navigator.permissions.query({ name: 'geolocation' })

  // the dialog has been ignored 3 times, the brower won't display it again
  if (state === 'denied') return GeolocPermissionState.NEVER_ASK_AGAIN

  return new Promise<GeolocPermissionState>((resolve) => {
    // display a dialog to ask for geolocation permission
    navigator.geolocation.getCurrentPosition(
      () => resolve(GeolocPermissionState.GRANTED),
      () => resolve(GeolocPermissionState.DENIED)
    )
  })
}
