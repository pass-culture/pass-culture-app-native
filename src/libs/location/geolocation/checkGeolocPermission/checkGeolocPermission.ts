import { ReadGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from './../enums'

export const checkGeolocPermission: ReadGeolocPermission = async function () {
  const { state } = await navigator.permissions.query({ name: 'geolocation' })
  if (state === 'granted') return GeolocPermissionState.GRANTED
  if (state === 'prompt') return GeolocPermissionState.DENIED
  return GeolocPermissionState.NEVER_ASK_AGAIN
}
