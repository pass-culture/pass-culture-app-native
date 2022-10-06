import React from 'react'
import styled from 'styled-components/native'

import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { analytics } from 'libs/firebase/analytics'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { Spacer, Typo } from 'ui/theme'

export function LoggedOutHeader() {
  const loginText = 'Déjà un compte\u00a0?\u00a0'
  return (
    <HeaderWithGreyContainer
      title="Mon profil"
      subtitle="Tu as entre 15 et 18 ans&nbsp;?"
      content={
        <React.Fragment>
          <Typo.Body>Identifie-toi pour bénéficier de ton crédit pass Culture</Typo.Body>
          <Spacer.Column numberOfSpaces={5} />
          <TouchableLink
            as={ButtonWithLinearGradient}
            wording="Créer un compte"
            navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
            onPress={() => analytics.logProfilSignUp()}
          />
          <Spacer.Column numberOfSpaces={5} />
          <StyledBody>
            {loginText}
            <TouchableLink
              as={StyledButtonInsideText}
              navigateTo={{ screen: 'Login', params: { preventCancellation: true } }}
              wording="Se connecter"
              icon={Connect}
            />
          </StyledBody>
        </React.Fragment>
      }
    />
  )
}

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  color: theme.colors.secondary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
