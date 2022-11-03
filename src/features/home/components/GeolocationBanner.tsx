import React, { useCallback } from 'react'

import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { GeolocationButton } from 'ui/components/GeolocationButton'

export const GeolocationBanner = () => {
  const { permissionState, requestGeolocPermission, showGeolocPermissionModal } = useGeolocation()

  const onPressGeolocationBanner = useCallback(async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }, [permissionState, requestGeolocPermission, showGeolocPermissionModal])

  return <GeolocationButton onPress={onPressGeolocationBanner} />
}
