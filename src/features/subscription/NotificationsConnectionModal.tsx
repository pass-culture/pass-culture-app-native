import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorUserNotification } from 'ui/svg/icons/BicolorUserNotification'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
}

export const NotificationsConnectionModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
}) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title="Identifie-toi pour t’abonner à un thème"
      Illustration={StyledIcon}
      hideModal={dismissModal}>
      <InformationText>
        Ton compte te permettra de recevoir toutes les offres et actus en lien avec tes thèmes
        préférés&nbsp;!
      </InformationText>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer>
        <InternalTouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { from: StepperOrigin.HOME } }}
          onBeforeNavigate={() => {
            analytics.logSignUpClicked({ from: 'SubButton' })
            dismissModal()
          }}
          buttonHeight="tall"
        />
        <Spacer.Column numberOfSpaces={4} />
        <StyledAuthenticationButton
          type="login"
          onAdditionalPress={() => {
            analytics.logSignUpClicked({ from: 'SubButton' })
            dismissModal()
          }}
          params={{ from: StepperOrigin.HOME }}
        />
      </ButtonContainer>
    </AppModalWithIllustration>
  )
}

const ButtonContainer = styled.View({
  width: '100%',
})

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
}))``

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledIcon = styled(BicolorUserNotification).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
