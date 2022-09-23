import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const CulturalSurveyThanks: React.FC = () => {
  return (
    <GenericInfoPageWhite
      fullWidth
      mobileBottomFlex={0.1}
      animation={QpiThanks}
      titleComponent={Typo.Title1}
      title="Un grand merci"
      subtitle="pour tes réponses&nbsp;!">
      <StyledBody>Tu peux dès maintenant découvrir l’étendue du catalogue pass Culture.</StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary
          testID="discover-button"
          wording="Découvrir le catalogue"
          onPress={navigateToHome}
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
