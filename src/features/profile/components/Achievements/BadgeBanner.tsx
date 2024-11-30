import React from 'react'

import { theme } from 'theme'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorTrophy } from 'ui/svg/icons/Trophy'
import { Spacer, Typo } from 'ui/theme'

export const BadgeBanner: React.FC = () => {
  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'Achievements',
        params: { from: 'profile' },
      }}>
      <GenericBanner LeftIcon={<BicolorTrophy size={theme.icons.sizes.standard} />}>
        <Typo.ButtonText>Mes badges</Typo.ButtonText>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Body numberOfLines={2}>Consulte tes prouesses</Typo.Body>
      </GenericBanner>
    </InternalTouchableLink>
  )
}
