import { t } from '@lingui/macro'
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
      title={t`Un grand merci`}
      subtitle={t`pour tes réponses\u00a0!`}>
      <TextContent>{t`Tu peux dès maintenant découvrir 
      l’étendue du catalogue pass Culture.`}</TextContent>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary
          testID="discover-button"
          wording={t`Découvrir le catalogue`}
          onPress={navigateToHome}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const TextContent = styled(Typo.Body)({
  textAlign: 'center',
})
