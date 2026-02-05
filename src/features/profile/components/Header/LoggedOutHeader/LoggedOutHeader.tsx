import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { analytics } from 'libs/analytics/provider'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Spacer, Typo } from 'ui/theme'

const onBeforeNavigate = () => {
  void analytics.logProfilSignUp()
  void analytics.logSignUpClicked({ from: 'profile' })
}

export const LoggedOutHeader = ({ featureFlags }: ProfileFeatureFlagsProps) => {
  const { isDesktopViewport, designSystem } = useTheme()

  return (
    <HeaderWithGreyContainer
      title="Mon profil"
      subtitle={featureFlags.enablePassForAll ? undefined : 'Tu as 17 ou 18 ans\u00a0?'}
      featureFlags={featureFlags}>
      <Typo.Body>
        Envie d’explorer des offres culturelles ou de débloquer ton crédit si tu as 17 ou 18
        ans&nbsp;?
      </Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <Container>
        <InternalTouchableLink
          as={Button}
          variant="primary"
          fullWidth
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupForm',
            params: { from: StepperOrigin.PROFILE },
          }}
          onBeforeNavigate={onBeforeNavigate}
          fitContentWidth={isDesktopViewport}
        />

        {isDesktopViewport ? <VerticalSeparator /> : <Spacer.Column numberOfSpaces={5} />}

        <AuthenticationButton
          type="login"
          linkColor={designSystem.color.text.brandSecondary}
          params={{ from: StepperOrigin.PROFILE }}
        />
      </Container>
    </HeaderWithGreyContainer>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: theme.isDesktopViewport ? 'row' : 'column',
  alignItems: theme.isDesktopViewport ? undefined : 'center',
}))

const VerticalSeparator = styled.View(({ theme }) => ({
  borderRightWidth: theme.designSystem.size.spacing.xxs,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  borderRightColor: theme.designSystem.color.border.default,
}))
