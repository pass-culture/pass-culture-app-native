import React, { FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorIdCardInvalid } from 'ui/svg/icons/BicolorIdCardInvalid'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const ComeBackLater: FunctionComponent = () => {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewComeBackLater)
  }, [])

  return (
    <GenericInfoPageWhite
      icon={BicolorIdCardInvalid}
      titleComponent={TypoDS.Title2}
      title="Reviens plus tard"
      separateIconFromTitle={false}
      headerGoBack
      mobileBottomFlex={0.5}>
      <StyledText>
        <TypoDS.Body>Pour profiter du pass Culture, tu dois avoir </TypoDS.Body>
        <TypoDS.BodyAccent>
          ta pièce d’identité originale et en cours de validité avec toi.
        </TypoDS.BodyAccent>
      </StyledText>
      <StyledText>N’hésite pas à revenir t’identifier quand tu l’auras avec toi&nbsp;!</StyledText>
      <Spacer.Flex flex={1} />
      <View>
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="M’identifier plus tard"
          navigateTo={navigateToHomeConfig}
          onBeforeNavigate={() => analytics.logComeBackLaterClicked(undefined)}
        />
      </View>
    </GenericInfoPageWhite>
  )
}

const StyledText = styled(TypoDS.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(6),
})
