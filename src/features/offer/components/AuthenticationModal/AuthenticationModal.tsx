import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { analytics } from 'libs/firebase/analytics'
import { theme } from 'theme'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorUserIdentification } from 'ui/svg/BicolorUserIdentification'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

import { From } from './fromEnum'

type Props = {
  visible: boolean
  hideModal: () => void
  offerId: number
  from: From
  children?: never
}

export const AuthenticationModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  offerId,
  from,
}) => {
  const closeModal = useCallback(() => {
    analytics.logQuitAuthenticationModal(offerId)
    hideModal()
  }, [hideModal, offerId])

  const signUp = useCallback(() => {
    analytics.logSignUpFromAuthenticationModal(offerId)
    hideModal()
  }, [hideModal, offerId])

  const signIn = useCallback(() => {
    analytics.logSignInFromAuthenticationModal(offerId)
    hideModal()
  }, [hideModal, offerId])

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Identifie-toi' + LINE_BREAK + 'pour réserver l’offre'}
      Illustration={BicolorUserIdentification}
      hideModal={closeModal}>
      <Typo.ButtonText>Tu as entre 15 et 18 ans&nbsp;?</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={2} />
      <StyledBody>
        Identifie-toi pour bénéficier de ton crédit et profiter des offres culturelles.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledButtonContainer>
        <InternalTouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { preventCancellation: true, offerId, from },
          }}
          onBeforeNavigate={signUp}
          fitContentWidth={theme.isDesktopViewport}
        />
      </StyledButtonContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledAuthenticationButton
        type="login"
        onAdditionalPress={signIn}
        params={{ offerId, from }}
        preventCancellation
      />
    </AppModalWithIllustration>
  )
}

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
}))``

const StyledButtonContainer = styled.View({
  width: '100%',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
