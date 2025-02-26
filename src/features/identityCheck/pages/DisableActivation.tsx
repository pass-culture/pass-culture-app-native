import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { env } from 'libs/environment/env'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { AgainIllustration } from 'ui/svg/icons/AgainIllustration'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { LINE_BREAK } from 'ui/theme/constants'

export const DisableActivation = () => {
  return (
    <GenericInfoPage
      icon={AgainIllustration}
      title={`Tu as 17 ou 18 ans\u00a0?${LINE_BREAK}Reviens lundi pour débloquer ton crédit\u00a0!`}
      buttons={[
        <InternalTouchableLink
          key={2}
          as={ButtonPrimaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={navigateToHomeConfig}
        />,
        <ExternalTouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          externalNav={{ url: env.FAQ_LINK_CREDIT_V3 }}
          wording="Plus d’infos dans notre FAQ"
          icon={ExternalSiteFilled}
        />,
      ]}
    />
  )
}
