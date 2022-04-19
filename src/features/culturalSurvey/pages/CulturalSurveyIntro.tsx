import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
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
      title={t`Prenons 1 minute`}
      subtitle={t`pour parler de tes pratiques culturelles\u00a0!`}>
      <StyledBody>
        {t`L'objectif du questionnaire est de nous permettre de te suggérer les meilleures activités culturelles selon tes préférences, tes envies et ta localisation.`}
      </StyledBody>
      <Spacer.Flex flex={1} />
      <View>
        <ButtonPrimary
          onPress={() =>
            navigate('CulturalSurveyQuestions', {
              step: initialQuestions[0],
            })
          }
          wording={t`Débuter le questionnaire`}
          testID={'start-cultural-survey'}
        />
      </View>
      <ButtonTertiaryBlackContainer>
        <ButtonTertiaryBlack
          wording={t`Plus tard`}
          onPress={navigateToHome}
          icon={ClockFilled}
          testID={'answer-survey-later'}
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
