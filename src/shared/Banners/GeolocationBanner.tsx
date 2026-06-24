import React, { FunctionComponent } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { LocationMode } from 'libs/location/types'
import { locationStore } from 'libs/locationV2/location.store'
import { requestGeolocPermission } from 'libs/locationV2/requestGeolocPermission'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Everywhere } from 'ui/svg/icons/Everywhere'

type Props = {
  title: string
  subtitle: string
  analyticsFrom: 'thematicHome' | 'search' | 'offer'
  onPress?: VoidFunction
  style?: StyleProp<ViewStyle>
}

export const GeolocationBanner: FunctionComponent<Props> = ({
  title,
  subtitle,
  analyticsFrom,
  onPress,
  style,
}) => {
  const isGeolocated = locationStore.hooks.useIsGeolocated()

  const onPressGeolocationBanner = async () => {
    onPress?.()
    void requestGeolocPermission({
      onSuccess: () => locationStore.actions.setLocationMode(LocationMode.AROUND_ME),
    })
  }

  if (isGeolocated) {
    return null
  }

  return (
    <View style={style}>
      <SystemBanner
        leftIcon={StyledLocationIcon}
        subtitle={subtitle}
        title={title}
        onPress={onPressGeolocationBanner}
        analyticsParams={{ type: 'location', from: analyticsFrom }}
      />
    </View>
  )
}

const StyledLocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.l,
  color: theme.designSystem.color.icon.brandSecondary,
}))``
