import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { UserIdentification as InitialUserIdentification } from 'ui/svg/UserIdentification'
import { Typo } from 'ui/theme'

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
      title="Crée-toi un compte ou connecte-toi"
      Illustration={UserIdentification}
      hideModal={closeModal}>
      <StyledBody>
        Identifie-toi pour découvrir tout ce que la culture a en réserve pour toi.
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

const StyledButtonContainer = styled.View(({ theme }) => ({
  width: '100%',
  marginBottom: theme.designSystem.size.spacing.l,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const UserIdentification = styled(InitialUserIdentification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
