import React from 'react'

import { useGetCulturalSurveyContent } from 'features/culturalSurvey/helpers/useGetCulturalSurveyContent'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const CulturalSurveyThanks: React.FC = () => {
  const enableCulturalSurveyMandatory = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY
  )

  const { thanks } = useGetCulturalSurveyContent(enableCulturalSurveyMandatory)

  return (
    <GenericInfoPage
      animation={QpiThanks}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      animationTargetLayerNames={['étoile', 'cadre']}
      title="Un grand merci pour tes réponses&nbsp;!"
      subtitle={thanks.subtitle}
      buttonPrimary={{
        wording: thanks.button.wording,
        onPress: thanks.button.onPress,
      }}
    />
  )
}
