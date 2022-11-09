import React, { useCallback } from 'react'

import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { GeolocationButton } from 'ui/components/GeolocationButton'
import { Spacer, Typo } from 'ui/theme'

export const GeolocationBanner = () => {
  const { permissionState, requestGeolocPermission, showGeolocPermissionModal } = useGeolocation()

  const onPressGeolocationBanner = useCallback(async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }, [permissionState, requestGeolocPermission, showGeolocPermissionModal])

  return (
    <GeolocationButton onPress={onPressGeolocationBanner}>
      <Typo.ButtonText>Géolocalise-toi</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Body numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Body>
    </GeolocationButton>
  )
}
