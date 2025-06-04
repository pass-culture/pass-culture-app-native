import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { HeaderWithGreyContainer } from 'features/profile/components/Header/HeaderWithGreyContainer/HeaderWithGreyContainer'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const onBeforeNavigate = () => {
  analytics.logProfilSignUp()
  analytics.logSignUpClicked({ from: 'profile' })
}

type Props = {
  featureFlags: {
    enablePassForAll: boolean
  }
}

export const LoggedOutHeader: FunctionComponent<Props> = ({ featureFlags }) => {
  const { isDesktopViewport, designSystem } = useTheme()

  return (
    <HeaderWithGreyContainer
      title="Mon profil"
      subtitle={featureFlags.enablePassForAll ? undefined : 'Tu as 17 ou 18 ans\u00a0?'}>
      <Typo.Body>
        Envie d’explorer des offres culturelles ou de débloquer ton crédit si tu as 17 ou 18
        ans&nbsp;?
      </Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <Container>
        <InternalTouchableLink
          as={ButtonPrimary}
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
}))

const VerticalSeparator = styled.View(({ theme }) => ({
  borderRightWidth: getSpacing(0.25),
  marginHorizontal: getSpacing(6),
  borderRightColor: theme.colors.greyMedium,
}))
