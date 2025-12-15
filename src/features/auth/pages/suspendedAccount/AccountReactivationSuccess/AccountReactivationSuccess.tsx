import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { LINE_BREAK } from 'ui/theme/constants'

export const AccountReactivationSuccess = () => (
  <GenericInfoPage
    animation={QpiThanks}
    animationColoringMode="targeted"
    animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
    animationTargetLayerNames={['étoile', 'cadre']}
    title="Ton compte a été réactivé"
    subtitle={`On est ravi de te revoir\u00a0!${LINE_BREAK}Tu peux dès maintenant découvrir l’étendue du catalogue pass Culture.`}
    buttonPrimary={{
      wording: 'Découvrir le catalogue',
      navigateTo: { ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } },
    }}
  />
)
