import { AppState } from 'react-native'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { GeolocationError } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'

export const initLocationPermission = () => {
  void syncPermissionsAndLocation()
  return AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void syncPermissionsAndLocation()
    }
  })
}

const syncPermissionsAndLocation = async () => {
  const permission = await checkGeolocPermission()
  locationActions.setPermissionState(permission)
  void syncLocation()
}

const syncLocation = async () => {
  const permission = locationSelectors.selectPermissionState()
  if (permission === GeolocPermissionState.GRANTED) {
    try {
      const newPosition = await getGeolocPosition()
      locationActions.setGeolocPosition(newPosition)
      locationActions.setGeolocationError(null)
    } catch (e) {
      const newPositionError = e as { cause: GeolocationError } | null
      locationActions.setGeolocPosition(null)
      locationActions.setGeolocationError(newPositionError?.cause ?? null)
    }
  }
}

export const requestGeolocPermission = async (params: { onSuccess?: () => void } = {}) => {
  const permission = await requestOSGeolocPermission()
  locationActions.setPermissionState(permission)
  await syncLocation()

  if (permission === GeolocPermissionState.GRANTED) {
    return params.onSuccess?.()
  }
  if (permission === GeolocPermissionState.NEVER_ASK_AGAIN) {
    locationActions.showPermissionModal()
  }
}
