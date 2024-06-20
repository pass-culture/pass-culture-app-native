import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer, Typo } from 'ui/theme'

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
  const enableSystemBanner = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK)

  const onPressGeolocationBanner = useCallback(async () => {
    if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
  }, [permissionState, requestGeolocPermission, showGeolocPermissionModal])

  return enableSystemBanner ? (
    <SystemBanner
      LeftIcon={<StyledLocationIcon />}
      accessibilityLabel="Active ta géolocalisation"
      subtitle={subtitle}
      title={title}
      // Possibility to use the onPress externally to avoid opening problems in modals
      onPress={onPress ?? onPressGeolocationBanner}
      analyticsParams={{ type: 'location', from: analyticsFrom }}
    />
  ) : (
    <Touchable
      // Possibility to use the onPress externally to avoid opening problems in modals
      onPress={onPress ?? onPressGeolocationBanner}
      accessibilityLabel="Active ta géolocalisation">
      <GenericBanner LeftIcon={<LocationIcon />} testID="genericBanner">
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

const StyledLocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
  color: theme.colors.secondaryLight200,
}))``
