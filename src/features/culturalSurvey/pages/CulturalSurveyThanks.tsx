import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const CulturalSurveyThanks: React.FC = () => {
  const { reset } = useNavigation<UseNavigationType>()

  const navigateToIdentityCheckHonor = () => {
    reset({
      index: 0,
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: { index: 0, routes: [{ name: 'IdentityCheckHonor' }] },
        },
      ],
    })
  }

  return (
    <GenericInfoPage
      animation={QpiThanks}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      animationTargetLayerNames={['étoile', 'cadre']}
      title="Un grand merci pour tes réponses&nbsp;!"
      subtitle="Elles nous permettent de suivre l’évolution de tes pratiques culturelles sur l’application."
      buttonPrimary={{
        wording: 'Continuer',
        onPress: navigateToIdentityCheckHonor,
      }}
    />
  )
}
