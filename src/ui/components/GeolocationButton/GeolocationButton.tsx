import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'

type Props = {
  onPress: () => void
}

export const GeolocationButton = ({ onPress, children }: PropsWithChildren<Props>) => {
  return (
    <Touchable onPress={onPress} accessibilityLabel="Active ta géolocalisation">
      <GenericBanner LeftIcon={LocationIcon}>{children}</GenericBanner>
    </Touchable>
  )
}

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``
