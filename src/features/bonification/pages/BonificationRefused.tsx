import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { SadFace } from 'ui/svg/icons/SadFace'

export function BonificationRefused() {
  return (
    <GenericInfoPage
      illustration={SadFace}
      title="Nous avons rencontré un refus"
      subtitle="Nous n’avons pas pu finaliser votre demande. Pas d’inquiétude, vous pouvez toujours essayer de résoudre le problème."
      buttonPrimary={{ wording: 'Vérifier le problème', navigateTo: navigateToHomeConfig }}
      buttonSecondary={{ wording: 'Revenir à l’accueil', navigateTo: navigateToHomeConfig }}
    />
  )
}
