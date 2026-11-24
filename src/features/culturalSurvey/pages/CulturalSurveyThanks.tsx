import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const CulturalSurveyThanks: React.FC = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

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
      remoteIllustration={
        enableNewVisionUi
          ? { url: remoteIllustrationUrls.thumbUpKnightLarge, backgroundColor: 'positive01' }
          : undefined
      }
      title="Un grand merci pour tes réponses&nbsp;!"
      subtitle="Elles nous permettent de suivre l’évolution de tes pratiques culturelles sur l’application."
      buttonPrimary={{
        wording: 'Continuer',
        onPress: navigateToIdentityCheckHonor,
      }}
    />
  )
}
