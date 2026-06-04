import { Linking } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { GeolocationError, RequestGeolocPermissionParams } from 'libs/location/types'
import { locationActions } from 'libs/locationV2/location.store'

export const triggerPositionUpdate = async () => {
  try {
    const newPosition = await getGeolocPosition()
    locationActions.setGeolocPosition(newPosition)
    locationActions.setGeolocationError(null)
    return newPosition
  } catch (e) {
    const newPositionError = e as { cause: GeolocationError } | null
    locationActions.setGeolocPosition(null)
    locationActions.setGeolocationError(newPositionError?.cause ?? null)
    return null
  }
}

const getPermissionState = async (permission: GeolocPermissionState) => {
  if (shouldTriggerPositionUpdate(permission)) {
    const newPosition = await triggerPositionUpdate()
    if (isNeedAskPosition(permission)) {
      return newPosition === null
        ? GeolocPermissionState.NEVER_ASK_AGAIN
        : GeolocPermissionState.GRANTED
    }
  }
  return permission
}

// this function is used to set OS permissions according to user choice on native geolocation popup
export const contextualRequestGeolocPermission = async (params?: RequestGeolocPermissionParams) => {
  params?.onSubmit?.()

  const permission = await getPermissionState(await requestGeolocPermission())

  if (isGranted(permission)) {
    !!params?.onAcceptance && params.onAcceptance()
  } else {
    !!params?.onRefusal && params.onRefusal()
  }
  locationActions.setPermissionState(permission)
}

// in case user updates his preferences in his phone settings we check if his local
// storage choice is consistent with phone permissions, and update position if not
export const contextualCheckPermission = async () => {
  const permission = await getPermissionState(await checkGeolocPermission())
  locationActions.setPermissionState(permission)
}

export const onPressGeolocPermissionModalButton = () => {
  void Linking.openSettings()
  locationActions.hidePermissionModal()
  void analytics.logOpenLocationSettings()
}

const isGranted = (permission: GeolocPermissionState) => {
  return permission === GeolocPermissionState.GRANTED
}

const isNeedAskPosition = (permission: GeolocPermissionState) => {
  return permission === GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY
}

const shouldTriggerPositionUpdate = (permission: GeolocPermissionState) => {
  return isGranted(permission) || isNeedAskPosition(permission)
}
