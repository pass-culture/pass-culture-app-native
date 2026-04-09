import React from 'react'

import { useGetCulturalSurveyContent } from 'features/culturalSurvey/helpers/useGetCulturalSurveyContent'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export const CulturalSurveyThanks: React.FC = () => {
  const { thanks } = useGetCulturalSurveyContent()

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
