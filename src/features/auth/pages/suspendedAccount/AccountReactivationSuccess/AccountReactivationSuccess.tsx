import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const AccountReactivationSuccess = () => (
  <GenericInfoPageWhite
    mobileBottomFlex={0.1}
    animation={QpiThanks}
    titleComponent={Typo.Title1}
    title="Ton compte a été réactivé">
    <StyledBody>On est ravi de te revoir&nbsp;!</StyledBody>
    <StyledBody>Tu peux dès maintenant découvrir l’étendue du catalogue pass Culture.</StyledBody>
    <Spacer.Flex flex={2} />
    <ButtonContainer>
      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Découvrir le catalogue"
        navigateTo={{ ...navigateToHomeConfig, params: { ...navigateToHomeConfig.params } }}
      />
    </ButtonContainer>
  </GenericInfoPageWhite>
)

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
