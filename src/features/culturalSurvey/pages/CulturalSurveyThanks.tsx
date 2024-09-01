import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const CulturalSurveyThanks: React.FC = () => {
  const { reset } = useNavigation<UseNavigationType>()

  const navigateToHomeAndShowShareAppModal = async () => {
    reset({
      index: 0,
      routes: [{ name: navigateToHomeConfig.screen }],
    })
  }

  return (
    <GenericInfoPageWhite
      mobileBottomFlex={0.1}
      animation={QpiThanks}
      title="Un grand merci"
      subtitle="pour tes réponses&nbsp;!">
      <StyledBody>Tu peux dès maintenant découvrir l’étendue du catalogue pass Culture.</StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary
          wording="Découvrir le catalogue"
          onPress={navigateToHomeAndShowShareAppModal}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
