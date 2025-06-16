import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { UserNotification } from 'ui/svg/UserNotification'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  dismissModal: () => void
  from: string
}

export const NotificationsLoggedOutModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  from,
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
          navigateTo={{ screen: 'SignupForm', params: { from: StepperOrigin.THEMATIC_HOME } }}
          onBeforeNavigate={() => {
            analytics.logSignUpClicked({ from })
            dismissModal()
          }}
          buttonHeight="tall"
        />
        <Spacer.Column numberOfSpaces={4} />
        <StyledAuthenticationButton
          type="login"
          onAdditionalPress={() => {
            analytics.logLoginClicked({ from })
            dismissModal()
          }}
          params={{ from: StepperOrigin.THEMATIC_HOME }}
        />
      </ButtonContainer>
    </AppModalWithIllustration>
  )
}

const ButtonContainer = styled.View({
  width: '100%',
})

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledIcon = styled(UserNotification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``
