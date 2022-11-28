import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const CulturalSurveyIntro = (): JSX.Element => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { questionsToDisplay: initialQuestions } = useCulturalSurveyContext()

  return (
    <GenericInfoPageWhite
      icon={StyledBicolorPhonePending}
      titleComponent={Typo.Title3}
      title="Prends 1 minute"
      subtitle="pour nous parler de tes activités culturelles préférées">
      <StyledBody>
        Tes réponses nous aideront à te proposer des offres qui pourraient te plaire&nbsp;!
      </StyledBody>
      <Spacer.Flex flex={1} />
      <View>
        <ButtonPrimary
          onPress={() => {
            analytics.logHasStartedCulturalSurvey()
            navigate('CulturalSurveyQuestions', {
              question: initialQuestions[0],
            })
          }}
          wording="Débuter le questionnaire"
        />
      </View>
      <ButtonTertiaryBlackContainer>
        <ButtonTertiaryBlack
          wording="Plus tard"
          onPress={() => {
            analytics.logHasSkippedCulturalSurvey()
            navigateToHome()
          }}
          icon={ClockFilled}
        />
      </ButtonTertiaryBlackContainer>
    </GenericInfoPageWhite>
  )
}

const StyledBicolorPhonePending = styled(BicolorPhonePending).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(5),
})

const ButtonTertiaryBlackContainer = styled.View({
  marginTop: getSpacing(3),
})
