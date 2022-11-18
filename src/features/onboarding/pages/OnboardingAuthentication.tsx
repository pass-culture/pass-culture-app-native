import { useNavigation } from '@react-navigation/native'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useCallback } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { AUTHENTICATION_BACKGROUND_SOURCE } from 'features/onboarding/components/authenticationBackground'
import { AuthenticationHeader } from 'features/onboarding/components/AuthenticationHeader'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const OnboardingAuthentication: FunctionComponent = () => {
  const { reset } = useNavigation<UseNavigationType>()

  // We need to reset navigation so that the goBack button in SignUp and Login redirects to Home
  const onBeforeNavigate = useCallback(() => {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }, [reset])

  return (
    <Container>
      <ImageBackground source={AUTHENTICATION_BACKGROUND_SOURCE} />
      <AuthenticationHeader />
      <Spacer.Flex />
      <Gradient />
      <Content>
        <StyledTitle1>Bienvenue sur le&nbsp;pass&nbsp;Culture</StyledTitle1>
        <Spacer.Column numberOfSpaces={4} />
        <StyledButtonText>Tu as entre 15 et 18 ans&nbsp;?</StyledButtonText>
        <Spacer.Column numberOfSpaces={2} />
        <StyledBody>
          Identifie-toi pour bénéficier de ton crédit et profiter des offres culturelles.
        </StyledBody>
        <Spacer.Column numberOfSpaces={6} />
        <TouchableLink
          as={ButtonWithLinearGradient}
          wording="Créer un compte"
          navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
          onBeforeNavigate={onBeforeNavigate}
        />
        <Spacer.Column numberOfSpaces={4} />
        <StyledAuthenticationButton type="login" onAdditionalPress={onBeforeNavigate} />
      </Content>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.colors.secondary,
}))``

const Content = styled.View(({ theme }) => ({
  width: '100%',
  alignSelf: 'center',
  position: 'static',
  bottom: 0,
  backgroundColor: theme.colors.white,
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(8),
}))

const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [colorAlpha(theme.colors.white, 0), theme.colors.white],
  locations: [0, 0.85],
}))(({ theme }) => ({
  height: theme.isSmallScreen ? getSpacing(30) : getSpacing(50),
}))

const ImageBackground = styled.ImageBackground({
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
})

const StyledTitle1 = styled(Typo.Title1)({
  textAlign: 'center',
})

const StyledButtonText = styled(Typo.ButtonText)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
