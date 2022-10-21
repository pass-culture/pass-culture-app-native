import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { analytics } from 'libs/firebase/analytics'
import { theme } from 'theme'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { BicolorUserIdentification } from 'ui/svg/BicolorUserIdentification'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  children?: never
}

export const AuthenticationModal: FunctionComponent<Props> = ({ visible, hideModal }) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Identifie-toi pour réserver l’offre'}
      Illustration={BicolorUserIdentification}
      hideModal={hideModal}>
      <Typo.ButtonText>Tu as entre 15 et 18 ans&nbsp;?</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={2} />
      <StyledBody>
        Identifie-toi pour bénéficier de ton crédit et profiter des offres culturelles.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledButtonContainer>
        <TouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
          onBeforeNavigate={() => {
            analytics.logProfilSignUp()
            hideModal()
          }}
          fitContentWidth={theme.isDesktopViewport}
        />
      </StyledButtonContainer>
      <Spacer.Column numberOfSpaces={4} />
      <AuthenticationButton type="login" onAdditionalPress={hideModal} />
    </AppModalWithIllustration>
  )
}

const StyledButtonContainer = styled.View({
  width: '100%',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
