import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonWithLinearGradientDeprecated } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradientDeprecated'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { UserNotification } from 'ui/svg/UserNotification'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

interface Props {
  visible: boolean
  offerId: number
  dismissModal: () => void
}

export const NotificationAuthModal: FunctionComponent<Props> = ({
  visible,
  offerId,
  dismissModal,
}) => {
  const closeModal = () => dismissModal()

  const signUp = useCallback(() => {
    analytics.logSignUpFromOffer(offerId)
    analytics.logSignUpClicked({ from: 'offer_notification' })
    dismissModal()
  }, [dismissModal, offerId])

  const signIn = useCallback(() => {
    analytics.logSignInFromOffer(offerId)
    dismissModal()
  }, [dismissModal, offerId])

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Identifie-toi pour' + LINE_BREAK + 'activer un rappel'}
      Illustration={StyledIcon}
      hideModal={closeModal}>
      <StyledBody>
        Ton compte te permettra de retrouver tous tes bons plans en un clin d’oeil&nbsp;!
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <StyledButtonContainer>
        <InternalTouchableLink
          as={ButtonWithLinearGradientDeprecated}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { from: StepperOrigin.NOTIFICATION, offerId },
          }}
          onBeforeNavigate={signUp}
        />
      </StyledButtonContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledAuthenticationButton
        type="login"
        params={{ from: StepperOrigin.NOTIFICATION, offerId }}
        onAdditionalPress={signIn}
      />
    </AppModalWithIllustration>
  )
}

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``

const StyledButtonContainer = styled.View({
  width: '100%',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledIcon = styled(UserNotification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``
