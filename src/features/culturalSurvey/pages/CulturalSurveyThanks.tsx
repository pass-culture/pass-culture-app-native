import React from 'react'
import styled from 'styled-components/native'

import { useGetCulturalSurveyContent } from 'features/culturalSurvey/helpers/useGetCulturalSurveyContent'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const CulturalSurveyThanks: React.FC = () => {
  const enableCulturalSurveyMandatory = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY
  )

  const { thanks } = useGetCulturalSurveyContent(enableCulturalSurveyMandatory)

  return (
    <GenericInfoPageWhiteLegacy
      mobileBottomFlex={0.1}
      animation={QpiThanks}
      title="Un grand merci"
      subtitle="pour tes réponses&nbsp;!">
      <StyledBody>{thanks.subtitle}</StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary wording={thanks.button.wording} onPress={thanks.button.onPress} />
      </ButtonContainer>
    </GenericInfoPageWhiteLegacy>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
