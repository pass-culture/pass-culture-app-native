import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { GeolocPermissionState, useLocation } from 'libs/location/location'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Everywhere } from 'ui/svg/icons/Everywhere'

type Props = {
  title: string
  subtitle: string
  analyticsFrom: 'thematicHome' | 'search' | 'offer'
  onPress?: VoidFunction
}

export const GeolocationBanner: FunctionComponent<Props> = ({
  title,
  subtitle,
  analyticsFrom,
  onPress,
}) => {
  const { permissionState, requestGeolocPermission, showGeolocPermissionModal } = useLocation()

  const onPressGeolocationBanner = useCallback(async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }, [permissionState, requestGeolocPermission, showGeolocPermissionModal])

  return (
    <SystemBanner
      leftIcon={StyledLocationIcon}
      subtitle={subtitle}
      title={title}
      // Possibility to use the onPress externally to avoid opening problems in modals
      onPress={onPress ?? onPressGeolocationBanner}
      analyticsParams={{ type: 'location', from: analyticsFrom }}
    />
  )
}

const StyledLocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  color: theme.designSystem.color.icon.brandSecondary,
}))``
