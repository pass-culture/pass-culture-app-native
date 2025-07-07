import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { UserIdentification as InitialUserIdentification } from 'ui/svg/UserIdentification'
import { Typo, getSpacing } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  offerId: number
  from: StepperOrigin
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
    analytics.logSignUpClicked({ from: 'offer_booking' })
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
      Illustration={UserIdentification}
      hideModal={closeModal}>
      <Typo.BodyAccent>Tu as 17 ou 18 ans&nbsp;?</Typo.BodyAccent>
      <StyledBody>
        Identifie-toi pour bénéficier de ton crédit et profiter des offres culturelles.
      </StyledBody>
      <StyledButtonContainer>
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { offerId, from },
          }}
          onBeforeNavigate={signUp}
        />
      </StyledButtonContainer>
      <StyledAuthenticationButton
        type="login"
        onAdditionalPress={signIn}
        params={{ offerId, from }}
      />
    </AppModalWithIllustration>
  )
}

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``

const StyledButtonContainer = styled.View({
  width: '100%',
  marginBottom: getSpacing(4),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  marginTop: getSpacing(2),
  marginBottom: getSpacing(6),
})

const UserIdentification = styled(InitialUserIdentification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
