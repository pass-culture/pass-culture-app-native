import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonWithLinearGradientDeprecated } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradientDeprecated'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { UserNotification } from 'ui/svg/UserNotification'
import { Typo, getSpacing } from 'ui/theme'

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
      <ButtonContainer gap={4}>
        <InternalTouchableLink
          as={ButtonWithLinearGradientDeprecated}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { from: StepperOrigin.THEMATIC_HOME } }}
          onBeforeNavigate={() => {
            analytics.logSignUpClicked({ from })
            dismissModal()
          }}
          buttonHeight="tall"
        />
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

const ButtonContainer = styled(ViewGap)({
  width: '100%',
})

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``

const InformationText = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(6),
})

const StyledIcon = styled(UserNotification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``
