import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { useLocation, GeolocPermissionState } from 'libs/location'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  subtitle: string
  onPress?: VoidFunction
}

export const GeolocationBanner: FunctionComponent<Props> = ({ title, subtitle, onPress }) => {
  const { permissionState, requestGeolocPermission, showGeolocPermissionModal } = useLocation()

  const onPressGeolocationBanner = useCallback(async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }, [permissionState, requestGeolocPermission, showGeolocPermissionModal])

  return (
    <Touchable
      // Possibility to use the onPress externally to avoid opening problems in modals
      onPress={onPress ?? onPressGeolocationBanner}
      accessibilityLabel="Active ta géolocalisation">
      <GenericBanner LeftIcon={LocationIcon}>
        <Typo.ButtonText>{title}</Typo.ButtonText>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Body numberOfLines={2}>{subtitle}</Typo.Body>
      </GenericBanner>
    </Touchable>
  )
}

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``
