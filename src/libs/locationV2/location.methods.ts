import { AppState, Linking } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission as requestOSGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { GeolocationError, LocationMode, RequestGeolocPermissionParams } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'

export const initLocationPermission = () => {
  void syncPermissionsAndLocation()
  return AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void syncPermissionsAndLocation()
    }
  })
}

export const syncPermissionsAndLocation = async () => {
  await syncPermissions()
  await syncLocationMode()
  await syncLocation()
}

const syncPermissions = async () => {
  const permission = await checkGeolocPermission()
  locationActions.setPermissionState(permission)
}

const syncLocationMode = async () => {
  if (
    locationSelectors.selectPermissionState() !== GeolocPermissionState.GRANTED &&
    locationSelectors.selectLocationMode() === LocationMode.AROUND_ME
  ) {
    locationActions.setLocationMode(LocationMode.EVERYWHERE)
  }
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

export const onPressGeolocPermissionModalButton = () => {
  void Linking.openSettings()
  locationActions.hidePermissionModal()
  void analytics.logOpenLocationSettings()
}

// this function is used to set OS permissions according to user choice on native geolocation popup
export const requestGeolocPermission = async (params?: RequestGeolocPermissionParams) => {
  params?.onSubmit?.()

  const permission = await requestOSGeolocPermission()
  locationActions.setPermissionState(permission)

  await syncLocation()

  if (permission === GeolocPermissionState.GRANTED) {
    params?.onAcceptance?.()
    return
  }
  params?.onRefusal?.()
}
