import React from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  onPress: () => void
}

export const GeolocationButton = ({ onPress }: Props) => {
  return (
    <Touchable onPress={onPress} accessibilityLabel="Active ta géolocalisation">
      <GenericBanner LeftIcon={LocationIcon}>
        <TitleText>Géolocalise toi</TitleText>
        <Spacer.Column numberOfSpaces={1} />
        <DescriptionText numberOfLines={2}>Pour trouver des offres autour de toi.</DescriptionText>
      </GenericBanner>
    </Touchable>
  )
}

const TitleText = styled(Typo.ButtonText)({
  textAlign: 'left',
})

const DescriptionText = styled(Typo.Caption)({
  textAlign: 'left',
})

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``
