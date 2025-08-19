import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { HappyFace } from 'ui/svg/icons/HappyFace'

export const UpdatePersonalDataConfirmation = () => (
  <GenericInfoPage
    illustration={HappyFace}
    title="C’est noté&nbsp;!"
    subtitle="Merci, tes informations ont bien été prises en compte."
    buttonPrimary={{
      wording: 'Terminer',
      navigateTo: navigateToHomeConfig,
    }}
  />
)
