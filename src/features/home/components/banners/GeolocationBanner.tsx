import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
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
    <Touchable onPress={onPressGeolocationBanner} accessibilityLabel="Active ta géolocalisation">
      <GenericBanner LeftIcon={LocationIcon}>
        <Typo.ButtonText>Géolocalise-toi</Typo.ButtonText>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Body numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Body>
      </GenericBanner>
    </Touchable>
  )
}

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``
