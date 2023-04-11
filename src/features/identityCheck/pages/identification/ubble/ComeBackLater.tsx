import React, { FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { amplitude } from 'libs/amplitude'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorIdCardInvalid } from 'ui/svg/icons/BicolorIdCardInvalid'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const ComeBackLater: FunctionComponent = () => {
  useEffect(() => {
    BatchUser.trackEvent(BatchEvent.screenViewComeBackLater)
    amplitude.logEvent('screen_view_come_back_later')
  }, [])

  return (
    <GenericInfoPageWhite
      icon={BicolorIdCardInvalid}
      titleComponent={Typo.Title2}
      title="Reviens plus tard"
      separateIconFromTitle={false}
      headerGoBack
      mobileBottomFlex={0.5}>
      <StyledText>
        <Typo.Body>Pour profiter du pass Culture, tu dois avoir </Typo.Body>
        <Typo.ButtonText>
          ta pièce d’identité originale et en cours de validité avec toi.
        </Typo.ButtonText>
      </StyledText>
      <StyledText>N’hésite pas à revenir t’identifier quand tu l’auras avec toi&nbsp;!</StyledText>
      <Spacer.Flex flex={1} />
      <View>
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="M’identifier plus tard"
          navigateTo={navigateToHomeConfig}
          onBeforeNavigate={() => amplitude.logEvent('come_back_later_clicked')}
        />
      </View>
    </GenericInfoPageWhite>
  )
}

const StyledText = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(6),
})
