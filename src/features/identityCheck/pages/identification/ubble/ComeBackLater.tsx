import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorIdCardInvalid } from 'ui/svg/icons/BicolorIdCardInvalid'
import { getSpacing, TypoDS } from 'ui/theme'

export const ComeBackLater: FunctionComponent = () => {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewComeBackLater)
  }, [])

  return (
    <GenericInfoPageWhite
      withGoBack
      illustration={BicolorIdCardInvalid}
      title="Reviens plus tard"
      buttonPrimary={{
        wording: 'M’identifier plus tard',
        navigateTo: navigateToHomeConfig,
        onBeforeNavigate: () => analytics.logComeBackLaterClicked(undefined),
      }}>
      <StyledText>
        <TypoDS.Body>Pour profiter du pass Culture, tu dois avoir </TypoDS.Body>
        <TypoDS.BodyAccent>
          ta pièce d’identité originale et en cours de validité avec toi.
        </TypoDS.BodyAccent>
      </StyledText>
      <StyledText>N’hésite pas à revenir t’identifier quand tu l’auras avec toi&nbsp;!</StyledText>
    </GenericInfoPageWhite>
  )
}

const StyledText = styled(TypoDS.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(6),
})
