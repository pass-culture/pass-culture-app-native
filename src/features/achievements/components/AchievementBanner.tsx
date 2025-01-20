import React from 'react'

import { theme } from 'theme'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorTrophy } from 'ui/svg/icons/BicolorTrophy'
import { Spacer, TypoDS } from 'ui/theme'

export const AchievementBanner: React.FC = () => {
  return (
    <InternalTouchableLink
      navigateTo={{
        screen: 'Achievements',
        params: { from: 'profile' },
      }}>
      <GenericBanner LeftIcon={<BicolorTrophy size={theme.icons.sizes.standard} />}>
        <TypoDS.BodyAccent>Mes succès</TypoDS.BodyAccent>
        <Spacer.Column numberOfSpaces={1} />
        <TypoDS.Body numberOfLines={2}>Consulte tes exploits</TypoDS.Body>
      </GenericBanner>
    </InternalTouchableLink>
  )
}
