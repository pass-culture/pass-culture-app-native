import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { IdCardInvalid } from 'ui/svg/icons/IdCardInvalid'
import { getSpacing, Typo } from 'ui/theme'

export const ComeBackLater: FunctionComponent = () => {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewComeBackLater)
  }, [])

  return (
    <GenericInfoPage
      withGoBack
      illustration={IdCardInvalid}
      title="Reviens plus tard"
      buttonPrimary={{
        wording: 'M’identifier plus tard',
        navigateTo: navigateToHomeConfig,
      }}>
      <StyledText>
        <Typo.Body>Pour profiter du pass Culture, tu dois avoir </Typo.Body>
        <Typo.BodyAccent>
          ta pièce d’identité originale et en cours de validité avec toi.
        </Typo.BodyAccent>
      </StyledText>
      <StyledText>N’hésite pas à revenir t’identifier quand tu l’auras avec toi&nbsp;!</StyledText>
    </GenericInfoPage>
  )
}

const StyledText = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(6),
})
